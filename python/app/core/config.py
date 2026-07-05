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

    # CORS
    ALLOWED_ORIGINS: str = Field(
        default=os.environ.get(
            "ALLOWED_ORIGINS",
            "https://team-d-excellence-hackbyifri-2026.vercel.app,http://localhost:5173,http://localhost:3000"
        )
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
    
    # Clés API IA
    GROQ_API_KEY: str | None = Field(default=(os.environ.get("GROQ_API_KEY")))
    OPENROUTER_API_KEY: str | None = Field(default=(os.environ.get("OPENROUTER_API_KEY")))
    OPENROUTER_MODEL: str = Field(default=os.environ.get("OPENROUTER_MODEL", "liquid/lfm-2.5-1.2b-thinking:free"))

    # Database (MySQL)
    DB_HOST: str | None = Field(default=(os.environ.get("DB_HOST")))
    DB_PORT: int = Field(default=int(os.environ.get("DB_PORT", "3306")))
    DB_NAME: str | None = Field(default=(os.environ.get("DB_NAME")))
    DB_USER: str | None = Field(default=(os.environ.get("DB_USER")))
    DB_PASSWORD: str | None = Field(default=(os.environ.get("DB_PASSWORD")))

    # Paths
    UPLOAD_DIR: str = Field(default="./uploads")
    GENERATED_DIR: str = Field(default="./generated")
    ROADMAP_PDF_DIR: str = Field(default="./generated/roadmaps/pdf")
    
    # Modèles LLM
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    SUMMARY_MODEL: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    QUIZ_MODEL: str = "qwen/qwen3-32b"
    EXERCISE_MODEL: str = "qwen/qwen3-32b"
    
    # Répertoires de sortie
    SUMMARY_OUTPUT_DIR: str = Field(default="./generated/summaries")
    QUIZ_OUTPUT_DIR: str = Field(default="./generated/quizzes")
    EXERCISE_OUTPUT_DIR: str = Field(default="./generated/exercises")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Création automatique des dossiers nécessaires au démarrage
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.SUMMARY_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.QUIZ_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.EXERCISE_OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.ROADMAP_PDF_DIR, exist_ok=True)
