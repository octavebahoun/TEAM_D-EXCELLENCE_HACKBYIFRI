from fastapi import APIRouter, HTTPException, Header
from app.services.student_analyzer import student_analyzer
from app.core.config import settings

router = APIRouter()


def _check_internal_auth(x_internal_key: str = None):
    """
    Vérifie la clé interne utilisée par le service Laravel
    pour appeler ce endpoint sans token d'utilisateur.
    """
    if not x_internal_key or x_internal_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Clé interne invalide ou manquante.")


@router.get("/{student_id}")
async def analyze_student_endpoint(
    student_id: int,
    x_internal_key: str = Header(None, alias="X-Internal-Key"),
):
    """
    Analyse IA complète d'un étudiant.

    Appelé en interne par le service Laravel (`PythonAIService`).
    Authentification : header `X-Internal-Key` = valeur de `API_KEY` dans .env

    Retourne :
    ```json
    {
      "success": true,
      "data": {
        "analysis": { "niveau_alerte": "...", "message_principal": "...", ... },
        "context":  { "moyenne_generale": 13.5, "matieres": [...], ... }
      }
    }
    ```
    """
    _check_internal_auth(x_internal_key)

    try:
        result = await student_analyzer.analyze_student(student_id)
        return {"success": True, "data": result}

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'analyse IA : {str(e)}",
        )
