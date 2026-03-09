import io

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse

from app.api.dependencies import get_current_user
from app.models.schemas import (
    RoadmapDetailResponse,
    RoadmapGenerationRequest,
    RoadmapGenerationResponse,
    RoadmapJobStatus,
    RoadmapSectionDetail,
    RoadmapStatusResponse,
)
from app.services.pdf_service import generate_roadmap_pdf
from app.services.roadmap_service import (
    create_roadmap_job,
    fetch_job_status,
    fetch_roadmap_detail,
    update_job_celery_id,
)
from app.tasks.roadmap_tasks import roadmap_pipeline_task


router = APIRouter()


@router.post(
    "/roadmap/generate",
    response_model=RoadmapGenerationResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def generate_roadmap(
    request: RoadmapGenerationRequest,
    current_user: dict = Depends(get_current_user),
):
    job = await create_roadmap_job(request, current_user["id"])
    celery_result = roadmap_pipeline_task.delay(job["job_uuid"])
    await update_job_celery_id(job["job_uuid"], celery_result.id)
    return RoadmapGenerationResponse(
        job_id=job["job_uuid"],
        roadmap_id=job["roadmap_id"],
        roadmap_uuid=job["roadmap_uuid"],
        message="Roadmap mise en file d'attente",
    )



@router.get(
    "/roadmap/{job_uuid}/status",
    response_model=RoadmapStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def roadmap_status(
    job_uuid: str,
    current_user: dict = Depends(get_current_user),
):
    job = await fetch_job_status(job_uuid)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job introuvable")

    if job.get("student_id") != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    status_value = job.get("status") or RoadmapJobStatus.pending.value
    try:
        status_enum = RoadmapJobStatus(status_value)
    except ValueError:
        status_enum = RoadmapJobStatus.pending

    return RoadmapStatusResponse(
        job_id=job["uuid"],
        status=status_enum,
        roadmap_id=job.get("roadmap_id"),
        roadmap_uuid=job.get("roadmap_uuid"),
        current_step=job.get("current_step"),
        progress=job.get("progress", {}),
        payload=job.get("payload", {}),
        started_at=job.get("started_at"),
        finished_at=job.get("finished_at"),
        celery_task_id=job.get("celery_task_id"),
        error_message=job.get("error_message"),
        roadmap_ready=status_enum == RoadmapJobStatus.done and bool(job.get("roadmap_id")),
    )


@router.get("/roadmap/{roadmap_uuid}/pdf")
async def roadmap_pdf(
    roadmap_uuid: str,
    current_user: dict = Depends(get_current_user),
) -> StreamingResponse:
    roadmap_payload = await fetch_roadmap_detail(roadmap_uuid)
    if not roadmap_payload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap introuvable")

    if roadmap_payload["roadmap"].get("student_id") != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    pdf_bytes = await generate_roadmap_pdf(roadmap_uuid)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=roadmap_{roadmap_uuid}.pdf"},
    )


@router.get(
    "/roadmap/{roadmap_uuid}",
    response_model=RoadmapDetailResponse,
)
async def get_roadmap(
    roadmap_uuid: str,
    current_user: dict = Depends(get_current_user),
):
    roadmap_payload = await fetch_roadmap_detail(roadmap_uuid)
    if not roadmap_payload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap introuvable")

    roadmap = roadmap_payload["roadmap"]
    if roadmap.get("student_id") != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    return RoadmapDetailResponse(
        roadmap_id=roadmap["id"],
        roadmap_uuid=roadmap["uuid"],
        student_id=roadmap["student_id"],
        mode=roadmap["mode"],
        matiere=roadmap.get("matiere"),
        matiere_id=roadmap.get("matiere_id"),
        notion=roadmap.get("notion"),
        niveau=roadmap.get("meta", {}).get("niveau"),
        status=roadmap.get("status") or RoadmapJobStatus.pending.value,
        summary=roadmap.get("summary"),
        meta=roadmap.get("meta", {}),
        sections=[
            RoadmapSectionDetail(**section)
            for section in roadmap_payload.get("sections", [])
        ],
        started_at=roadmap.get("started_at"),
        finished_at=roadmap.get("finished_at"),
        created_at=roadmap.get("created_at"),
    )

