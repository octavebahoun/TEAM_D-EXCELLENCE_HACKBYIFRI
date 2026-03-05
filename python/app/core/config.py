import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Academix RAG API"
    VERSION: str = "1.0.0"
    
    # Configuration API
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=int(os.environ.get("PORT", "5000")))
    API_RELOAD: bool = Field(default=os.environ.get("API_RELOAD", "false").lower() == "true")
    API_KEY: str = Field(default="your_secret_api_key_change_this")

    # Origines CORS autorisées (séparées par des virgules dans .env)
    # Ex : ALLOWED_ORIGINS=https://mon-app.vercel.app,http://localhost:5173
    ALLOWED_ORIGINS: str = Field(
        default=os.environ.get(
            "ALLOWED_ORIGINS",
            "https://team-d-excellence-hackbyifri-2026.vercel.app,http://localhost:5173,http://localhost:3000"
        )
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
    
    # Clés API - OBLIGATOIRES pour le fonctionnement
    GROQ_API_KEY: str | None = Field(default=(os.environ.get("GROQ_API_KEY")))
    HF_TOKEN: str | None = Field(default=(os.environ.get("HF_TOKEN")))
    OPENROUTER_API_KEY: str | None = Field(default=(os.environ.get("OPENROUTER_API_KEY")))
    OPENROUTER_MODEL: str = Field(default=os.environ.get("OPENROUTER_MODEL", "liquid/lfm-2.5-1.2b-thinking:free"))
    YOUTUBE_API_KEY: str | None = Field(default=(os.environ.get("YOUTUBE_API_KEY")))

    # Configuration Base de données (MySQL)
    DB_HOST: str | None = Field(default=(os.environ.get("DB_HOST")))
    DB_PORT: int = Field(default=int(os.environ.get("DB_PORT", "3306")))
    DB_NAME: str | None = Field(default=(os.environ.get("DB_NAME")))
    DB_USER: str | None = Field(default=(os.environ.get("DB_USER")))
    DB_PASSWORD: str | None = Field(default=(os.environ.get("DB_PASSWORD")))

    # Redis / Celery
    REDIS_URL: str = Field(default=os.environ.get("REDIS_URL", "redis://localhost:6379/0"))
    CELERY_BROKER_URL: str = Field(default=os.environ.get("CELERY_BROKER_URL", os.environ.get("REDIS_URL", "redis://localhost:6379/0")))
    CELERY_RESULT_BACKEND: str = Field(default=os.environ.get("CELERY_RESULT_BACKEND", os.environ.get("REDIS_URL", "redis://localhost:6379/0")))

    # Configuration uploads
    MAX_UPLOAD_SIZE: int = Field(default=10485760)  # 10MB
    ALLOWED_EXTENSIONS: str = Field(default=".pdf,.txt,.md,.docs")
    
    # Paths
    UPLOAD_DIR: str = Field(default="./uploads")
    GENERATED_DIR: str = Field(default="./generated")
    CHROMA_DB_DIR: str = Field(default="./generated/chroma_db")
    ROADMAP_PDF_DIR: str = Field(default="./generated/roadmaps/pdf")
    
    # Modèles
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    SUMMARY_MODEL: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    QUIZ_MODEL: str = "qwen/qwen3-32b"
    EXERCISE_MODEL: str = "qwen/qwen3-32b"
    
    # Répertoires de sortie
    SUMMARY_OUTPUT_DIR: str = Field(default="./generated/summaries")
    QUIZ_OUTPUT_DIR: str = Field(default="./generated/quizzes")
    EXERCISE_OUTPUT_DIR: str = Field(default="./generated/exercises")

    WHISPER_MODEL: str = Field(default=os.environ.get("WHISPER_MODEL", "small"))
    WHISPER_DEVICE: str = Field(default=os.environ.get("WHISPER_DEVICE", "cpu"))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,  # Important pour charger GROQ_API_KEY correctement
        extra="ignore"
    )

settings = Settings()

# Création automatique des dossiers nécessaires au démarrage
os.makedirs(settings.CHROMA_DB_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.SUMMARY_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.QUIZ_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.EXERCISE_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.ROADMAP_PDF_DIR, exist_ok=True)
