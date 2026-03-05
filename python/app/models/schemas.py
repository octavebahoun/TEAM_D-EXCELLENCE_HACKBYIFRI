from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class SummaryLevel(str, Enum):
    short = "short"
    medium = "medium"
    detailed = "detailed"


class SummaryStyle(str, Enum):
    bullets = "bullets"
    narrative = "narrative"
    schema = "schema"
    qa = "qa"


class SummaryFormat(str, Enum):
    markdown = "markdown"
    json = "json"


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    history: List[Message] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []  # Pour afficher les sources utilisées 

#  UPLOAD SCHEMAS 

class FileUploadResponse(BaseModel):
    filename: str
    chunks: int
    message: str


# SUMMARY SCHEMAS

class SummaryRequest(BaseModel):
    level: SummaryLevel = Field(default=SummaryLevel.medium, description="Niveau de détail")
    style: SummaryStyle = Field(default=SummaryStyle.bullets, description="Style de rédaction")
    format: SummaryFormat = Field(default=SummaryFormat.markdown, description="Format de sortie")
    matiere: Optional[str] = Field(default=None, description="Matière du cours")


class SummaryResponse(BaseModel):
    summary_id: str
    title: str
    content: str
    keywords: List[str]
    word_count: int
    format: str
    download_url: Optional[str] = None


# QUIZ SCHEMAS

class QuizDifficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Question(BaseModel):
    question: str
    options: List[str]
    correct_index: int = Field(description="Index de la bonne réponse (0-3)")
    explanation: str = Field(description="Explication de la réponse")
    difficulty: str = Field(default="medium")


class QuizResponse(BaseModel):
    quiz_id: str
    title: str
    questions: List[Question]
    nb_questions: int
    difficulty: str
    matiere: Optional[str] = None


class QuizCorrectionRequest(BaseModel):
    quiz_id: str
    answers: List[int] = Field(description="Liste des index de réponses de l'étudiant")


class QuestionResult(BaseModel):
    question: str
    student_answer: int
    correct_answer: int
    is_correct: bool
    explanation: str


class CorrectionResponse(BaseModel):
    quiz_id: str
    score: int
    total: int
    percentage: float
    details: List[QuestionResult]


# EXERCISE SCHEMAS

class ExerciseDifficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"
    progressive = "progressive"


class Exercise(BaseModel):
    numero: int
    enonce: str
    difficulty: str
    indice: str = Field(default="", description="Indice pour aider l'étudiant")
    correction: str = Field(description="Correction détaillée")
    points_cles: List[str] = Field(default=[], description="Points pédagogiques")


class ExerciseResponse(BaseModel):
    exercise_id: str
    title: str
    matiere: Optional[str] = None
    chapitre: Optional[str] = None
    exercises: List[Exercise]
    nb_exercises: int
    difficulty: str
    download_url: Optional[str] = None


# ── STUDENT ANALYSIS SCHEMAS ──────────────────────────────────────────────────

class MatiereSummary(BaseModel):
    nom: str
    moyenne: float
    nb_notes: int
    coefficient: float


class AnalysisContext(BaseModel):
    etudiant_nom: str
    filiere: str
    niveau: str
    moyenne_generale: float
    nb_notes_total: int
    matieres: List[MatiereSummary]
    matieres_faibles: List[str]
    matieres_excellentes: List[str]
    nb_taches_total: int
    taux_completion_taches: float
    nb_taches_urgentes: int


class AnalysisResult(BaseModel):
    niveau_alerte: str = "info"        # info | warning | danger
    message_principal: str
    conseils: List[str]
    matieres_prioritaires: List[str]
    point_positif: Optional[str] = None

    @field_validator('niveau_alerte')
    @classmethod
    def validate_niveau_alerte(cls, v):
        allowed = {'info', 'warning', 'danger'}
        if v not in allowed:
            return 'warning'  # fallback sûr
        return v


class StudentAnalysisData(BaseModel):
    analysis: AnalysisResult
    context: AnalysisContext


class StudentAnalysisResponse(BaseModel):
    success: bool
    data: StudentAnalysisData


class RoadmapJobStatus(str, Enum):
    pending = "pending"
    analyzing = "analyzing"
    scraping = "scraping"
    transcribing = "transcribing"
    evaluating = "evaluating"
    building = "building"
    done = "done"
    failed = "failed"


class RoadmapGenerationRequest(BaseModel):
    mode: str = Field(description="Mode pédagogique demandé, ex: 'Révision guidée'")
    matiere: Optional[str] = Field(default=None)
    matiere_id: Optional[int] = Field(default=None)
    notion: Optional[str] = Field(default=None)
    niveau: Optional[str] = Field(default=None, description="Niveau souhaité pour la roadmap")


class RoadmapGenerationResponse(BaseModel):
    job_id: str
    roadmap_id: Optional[int]
    roadmap_uuid: Optional[str]
    message: str


class RoadmapStatusResponse(BaseModel):
    job_id: str
    roadmap_id: Optional[int]
    roadmap_uuid: Optional[str]
    status: RoadmapJobStatus
    current_step: Optional[str]
    progress: Dict[str, Any] = Field(default_factory=dict)
    payload: Optional[Dict[str, Any]]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    celery_task_id: Optional[str]
    error_message: Optional[str]
    roadmap_ready: bool


class RoadmapResourceDetail(BaseModel):
    resource_id: int
    resource_type: str
    title: Optional[str]
    url: str
    source: Optional[str]
    thumbnail_url: Optional[str]
    duration_seconds: Optional[int]
    score: Optional[int]
    level: Optional[str]
    summary: Optional[str]
    transcript: Optional[str]
    status: Optional[str]
    metadata: Dict[str, Any] = Field(default_factory=dict)


class RoadmapSectionDetail(BaseModel):
    section_id: int
    title: str
    description: Optional[str]
    position: int
    period_label: Optional[str]
    metadata: Dict[str, Any] = Field(default_factory=dict)
    resources: List[RoadmapResourceDetail] = Field(default_factory=list)


class RoadmapDetailResponse(BaseModel):
    roadmap_id: int
    roadmap_uuid: str
    student_id: int
    mode: str
    matiere: Optional[str]
    matiere_id: Optional[int]
    notion: Optional[str]
    niveau: Optional[str]
    status: str
    summary: Optional[str]
    meta: Dict[str, Any] = Field(default_factory=dict)
    sections: List[RoadmapSectionDetail]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    created_at: Optional[datetime]
