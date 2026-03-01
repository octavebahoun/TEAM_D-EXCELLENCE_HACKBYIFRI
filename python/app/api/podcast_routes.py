import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from gtts import gTTS
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings
from app.api.dependencies import get_current_user
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from app.services import history_service

router = APIRouter()

PODCAST_DIR = os.path.join(settings.GENERATED_DIR, "podcasts")
os.makedirs(PODCAST_DIR, exist_ok=True)

# Prompt pour résumer le cours en format podcast oral
PODCAST_SUMMARY_PROMPT = """Tu es un créateur de podcasts éducatifs pour AcademiX.

MISSION:
Transforme le cours ci-dessous en un SCRIPT DE PODCAST oral, fluide et captivant.

RÈGLES:
- Le script doit être rédigé comme si quelqu'un le LISAIT À VOIX HAUTE
- Utilise un ton pédagogique, clair et engageant
- Commence par une introduction accueillante
- Structure en sections avec des transitions naturelles ("Passons maintenant à...", "Un point important...")
- Termine par un récapitulatif des points essentiels et un mot de fin
- Longueur: environ 800-1200 mots (5-8 minutes de lecture)
- Langue: Français clair et naturel
- PAS de markdown, PAS de bullet points, PAS de caractères spéciaux
- PAS d'émojis ni de symboles, uniquement du texte lisible à voix haute
- Évite les abréviations (écris "c'est-à-dire" au lieu de "c.-à-d.")

COURS À TRANSFORMER:
{document_content}

SCRIPT DU PODCAST:"""


async def _summarize_for_podcast(text: str) -> str:
    """Utilise l'IA pour résumer le texte en format podcast oral."""
    
    # Limiter le texte source pour ne pas dépasser le contexte
    max_chars = 15000
    if len(text) > max_chars:
        text = text[:max_chars]
    
    if settings.GROQ_API_KEY:
        os.environ["GROQ_API_KEY"] = settings.GROQ_API_KEY
    
    llm = ChatGroq(
        model=settings.SUMMARY_MODEL,
        temperature=0.6,
        max_tokens=4096
    )
    
    prompt = ChatPromptTemplate.from_template(PODCAST_SUMMARY_PROMPT)
    chain = prompt | llm | StrOutputParser()
    
    script = await chain.ainvoke({"document_content": text})
    return script


@router.post("/generate")
async def generate_podcast_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Génère un podcast audio à partir d'un fichier PDF ou TXT.
    Le contenu est d'abord résumé par l'IA en format oral, puis converti en audio par gTTS.
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Fichier manquant")
        
        # Vérification de l'extension
        allowed_extensions = ['.pdf', '.txt', '.md']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Extension non supportée. Utilisez: {', '.join(allowed_extensions)}"
            )
            
        temp_path = os.path.join(settings.UPLOAD_DIR, f"temp_podcast_{file.filename}")
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 1. Extraire le texte du document
        if temp_path.endswith(".pdf"):
            loader = PyPDFLoader(temp_path)
            docs = loader.load()
            text = " ".join([d.page_content for d in docs])
        else:
            loader = TextLoader(temp_path, encoding="utf-8")
            docs = loader.load()
            text = docs[0].page_content
            
        # Nettoyage du fichier temporaire
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Le fichier est vide ou illisible")
        
        # 2. Résumé IA en format podcast oral
        podcast_script = await _summarize_for_podcast(text)
        
        # 3. Générer l'audio avec gTTS
        tts = gTTS(text=podcast_script, lang="fr", slow=False)
        podcast_id = str(uuid.uuid4())
        audio_path = os.path.join(PODCAST_DIR, f"{podcast_id}.mp3")
        tts.save(audio_path)
        
        # 4. Sauvegarder le script texte pour référence
        script_path = os.path.join(PODCAST_DIR, f"{podcast_id}.txt")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(podcast_script)
        
        # Calculer la taille du fichier audio
        audio_size = os.path.getsize(audio_path)
        
        # Sauvegarde dans l'historique
        try:
            history_service.save(
                user_id=current_user["id"],
                service_type="podcast",
                filename=file.filename,
                matiere=None,
                result_id=podcast_id,
                meta={"audio_url": f"/api/v1/podcast/download/{podcast_id}", "audio_size_bytes": audio_size, "title": os.path.splitext(file.filename)[0]},
            )
        except Exception:
            pass
        
        return {
            "podcast_id": podcast_id,
            "filename": file.filename,
            "url": f"/api/v1/podcast/download/{podcast_id}",
            "script": podcast_script,
            "audio_size_bytes": audio_size
        }
    except HTTPException:
        raise
    except Exception as e:
        # Nettoyage en cas d'erreur
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération du podcast: {str(e)}")


@router.get("/download/{podcast_id}")
async def download_podcast(podcast_id: str, current_user: dict = Depends(get_current_user)):
    """Télécharge un podcast audio généré (protégé par authentification)."""
    audio_path = os.path.join(PODCAST_DIR, f"{podcast_id}.mp3")
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Podcast non trouvé")
    return FileResponse(audio_path, media_type="audio/mpeg", filename=f"podcast_{podcast_id}.mp3")
