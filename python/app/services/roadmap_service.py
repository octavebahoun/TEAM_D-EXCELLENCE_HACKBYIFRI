import json
import uuid
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

from app.api.dependencies import get_db_pool
from app.models.schemas import RoadmapGenerationRequest, RoadmapJobStatus


def _now_str() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


def _parse_json_field(value: Optional[str]) -> Dict[str, Any]:
    if not value:
        return {}
    try:
        if isinstance(value, dict):
            return value
        return json.loads(value)
    except json.JSONDecodeError:
        return {}


async def create_roadmap_job(request: RoadmapGenerationRequest, student_id: int) -> Dict[str, Any]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Impossible d'obtenir un pool PostgreSQL pour créer une roadmap")

    payload = request.model_dump(exclude_none=True)
    now = _now_str()
    roadmap_uuid = str(uuid.uuid4())
    job_uuid = str(uuid.uuid4())

    async with pool.acquire() as conn:
        row_roadmap = await conn.fetchrow(
            """
            INSERT INTO roadmaps (uuid, student_id, mode, matiere, matiere_id, notion, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            """,
            roadmap_uuid,
            student_id,
            request.mode,
            request.matiere,
            request.matiere_id,
            request.notion,
            RoadmapJobStatus.pending.value,
            now,
            now,
        )
        roadmap_id = row_roadmap['id']

        row_job = await conn.fetchrow(
            """
            INSERT INTO roadmap_jobs (uuid, student_id, roadmap_id, status, payload, progress, started_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            """,
            job_uuid,
            student_id,
            roadmap_id,
            RoadmapJobStatus.pending.value,
            json.dumps(payload, ensure_ascii=False),
            json.dumps({"stage": "pending"}),
            now,
            now,
            now,
        )
        job_id = row_job['id']

    return {
        "job_id": job_id,
        "job_uuid": job_uuid,
        "roadmap_id": roadmap_id,
        "roadmap_uuid": roadmap_uuid,
    }


async def fetch_job_status(job_uuid: str) -> Optional[Dict[str, Any]]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    async with pool.acquire() as conn:
        job_row = await conn.fetchrow(
            """
            SELECT j.*, r.uuid as roadmap_uuid
            FROM roadmap_jobs j
            LEFT JOIN roadmaps r ON r.id = j.roadmap_id
            WHERE j.uuid = $1
            """,
            job_uuid,
        )

        if not job_row:
            return None

        job = dict(job_row)
        job["payload"] = _parse_json_field(job.get("payload"))
        job["progress"] = _parse_json_field(job.get("progress"))
        return job


async def fetch_roadmap_detail(roadmap_uuid: str) -> Optional[Dict[str, Any]]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    async with pool.acquire() as conn:
        roadmap_row = await conn.fetchrow("SELECT * FROM roadmaps WHERE uuid = $1", roadmap_uuid)
        if not roadmap_row:
            return None

        roadmap = dict(roadmap_row)
        roadmap_meta = _parse_json_field(roadmap.get("meta"))

        sections_rows = await conn.fetch(
            "SELECT * FROM roadmap_sections WHERE roadmap_id = $1 ORDER BY position ASC",
            roadmap["id"],
        )
        sections_data: List[Dict[str, Any]] = []

        for section_row in sections_rows:
            section = dict(section_row)
            resources_rows = await conn.fetch(
                "SELECT * FROM roadmap_resources WHERE section_id = $1 ORDER BY id ASC",
                section["id"],
            )
            resource_data = []
            for resource_row in resources_rows:
                resource = dict(resource_row)
                resource_data.append(
                    {
                        "resource_id": resource["id"],
                        "resource_type": resource["resource_type"],
                        "title": resource.get("title"),
                        "url": resource["url"],
                        "source": resource.get("source"),
                        "thumbnail_url": resource.get("thumbnail_url"),
                        "duration_seconds": resource.get("duration_seconds"),
                        "score": resource.get("score"),
                        "level": resource.get("level"),
                        "summary": resource.get("summary"),
                        "transcript": resource.get("transcript"),
                        "status": resource.get("status"),
                        "metadata": _parse_json_field(resource.get("metadata")),
                    }
                )
            sections_data.append(
                {
                    "section_id": section["id"],
                    "title": section["title"],
                    "description": section.get("description"),
                    "position": section.get("position", 0),
                    "period_label": section.get("period_label"),
                    "metadata": _parse_json_field(section.get("metadata")),
                    "resources": resource_data,
                }
            )

    return {
        "roadmap": {
            **roadmap,
            "meta": roadmap_meta,
        },
        "sections": sections_data,
    }


def _format_datetime(value: Optional[Any]) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return str(value)


async def update_job(
    job_uuid: str,
    status: Optional[RoadmapJobStatus] = None,
    current_step: Optional[str] = None,
    progress: Optional[Dict[str, Any]] = None,
    celery_task_id: Optional[str] = None,
    error_message: Optional[str] = None,
    started_at: Optional[Any] = None,
    finished_at: Optional[Any] = None,
) -> None:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    columns = []
    params: List[Any] = []
    param_idx = 1

    if status is not None:
        columns.append(f"status = ${param_idx}")
        status_value = status.value if isinstance(status, RoadmapJobStatus) else str(status)
        params.append(status_value)
        param_idx += 1
    if current_step is not None:
        columns.append(f"current_step = ${param_idx}")
        params.append(current_step)
        param_idx += 1
    if progress is not None:
        columns.append(f"progress = ${param_idx}")
        params.append(json.dumps(progress, ensure_ascii=False))
        param_idx += 1
    if celery_task_id is not None:
        columns.append(f"celery_task_id = ${param_idx}")
        params.append(celery_task_id)
        param_idx += 1
    if error_message is not None:
        columns.append(f"error_message = ${param_idx}")
        params.append(error_message)
        param_idx += 1
    if started_at is not None:
        columns.append(f"started_at = ${param_idx}")
        params.append(_format_datetime(started_at))
        param_idx += 1
    if finished_at is not None:
        columns.append(f"finished_at = ${param_idx}")
        params.append(_format_datetime(finished_at))
        param_idx += 1

    if not columns:
        return

    columns.append(f"updated_at = ${param_idx}")
    params.append(_now_str())
    param_idx += 1

    params.append(job_uuid)
    query = f"UPDATE roadmap_jobs SET {', '.join(columns)} WHERE uuid = ${param_idx}"

    async with pool.acquire() as conn:
        await conn.execute(query, *params)


async def update_roadmap(
    roadmap_id: int,
    *,
    status: Optional[RoadmapJobStatus] = None,
    summary: Optional[str] = None,
    meta: Optional[Dict[str, Any]] = None,
    finished_at: Optional[Any] = None,
) -> None:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    columns = []
    params: List[Any] = []
    param_idx = 1

    if status is not None:
        columns.append(f"status = ${param_idx}")
        params.append(status.value if isinstance(status, RoadmapJobStatus) else str(status))
        param_idx += 1
    if summary is not None:
        columns.append(f"summary = ${param_idx}")
        params.append(summary)
        param_idx += 1
    if meta is not None:
        columns.append(f"meta = ${param_idx}")
        params.append(json.dumps(meta, ensure_ascii=False))
        param_idx += 1
    if finished_at is not None:
        columns.append(f"finished_at = ${param_idx}")
        params.append(_format_datetime(finished_at))
        param_idx += 1

    if not columns:
        return

    columns.append(f"updated_at = ${param_idx}")
    params.append(_now_str())
    param_idx += 1

    params.append(roadmap_id)
    query = f"UPDATE roadmaps SET {', '.join(columns)} WHERE id = ${param_idx}"

    async with pool.acquire() as conn:
        await conn.execute(query, *params)


async def insert_section(
    roadmap_id: int,
    title: str,
    description: Optional[str],
    position: int,
    period_label: Optional[str],
    metadata: Optional[Dict[str, Any]] = None,
) -> int:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    metadata_json = json.dumps(metadata or {}, ensure_ascii=False)
    now = _now_str()

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO roadmap_sections (roadmap_id, title, description, position, period_label, metadata, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            """,
            roadmap_id,
            title,
            description,
            position,
            period_label,
            metadata_json,
            now,
            now,
        )
        return row['id']


async def insert_resource(
    section_id: int,
    resource: Dict[str, Any],
) -> int:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    metadata_json = json.dumps(resource.get("metadata", {}), ensure_ascii=False)
    now = _now_str()

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO roadmap_resources
            (section_id, resource_type, title, url, source, thumbnail_url, duration_seconds, score, level, summary, transcript, status, metadata, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id
            """,
            section_id,
            resource.get("resource_type", "video"),
            resource.get("title"),
            resource.get("url"),
            resource.get("source"),
            resource.get("thumbnail_url"),
            resource.get("duration_seconds"),
            resource.get("score"),
            resource.get("level"),
            resource.get("summary"),
            resource.get("transcript"),
            resource.get("status", "pending"),
            metadata_json,
            now,
            now,
        )
        return row['id']


async def clear_roadmap_sections(roadmap_id: int) -> None:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool PostgreSQL indisponible")

    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM roadmap_resources WHERE section_id IN (SELECT id FROM roadmap_sections WHERE roadmap_id = $1)",
            roadmap_id,
        )
        await conn.execute(
            "DELETE FROM roadmap_sections WHERE roadmap_id = $1",
            roadmap_id,
        )


async def persist_sections(roadmap_id: int, sections: Iterable[Dict[str, Any]]) -> None:
    position = 1
    for section in sections:
        section_id = await insert_section(
            roadmap_id=roadmap_id,
            title=section["title"],
            description=section.get("description"),
            position=section.get("position", position),
            period_label=section.get("period_label"),
            metadata=section.get("metadata"),
        )

        for resource in section.get("resources", []):
            await insert_resource(section_id, resource)

        position += 1


async def mark_job_failed(job_uuid: str, message: str) -> None:
    await update_job(
        job_uuid,
        status=RoadmapJobStatus.failed,
        current_step="error",
        progress={"stage": "failed", "detail": message[:200]},
        error_message=message,
        finished_at=_now_str(),
    )


async def mark_job_done(job_uuid: str) -> None:
    await update_job(
        job_uuid,
        status=RoadmapJobStatus.done,
        current_step="done",
        progress={"stage": "done"},
        finished_at=_now_str(),
    )


async def update_job_celery_id(job_uuid: str, celery_task_id: str) -> None:
    await update_job(job_uuid, celery_task_id=celery_task_id)
