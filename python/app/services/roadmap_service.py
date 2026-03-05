import json
import uuid
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

import aiomysql

from app.api.dependencies import get_db_pool
from app.models.schemas import RoadmapGenerationRequest, RoadmapJobStatus


def _now_str() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


def _parse_json_field(value: Optional[str]) -> Dict[str, Any]:
    if not value:
        return {}
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return {}


async def create_roadmap_job(request: RoadmapGenerationRequest, student_id: int) -> Dict[str, Any]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Impossible d'obtenir un pool MySQL pour créer une roadmap")

    payload = request.model_dump(exclude_none=True)
    now = _now_str()
    roadmap_uuid = str(uuid.uuid4())
    job_uuid = str(uuid.uuid4())

    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                INSERT INTO roadmaps (uuid, student_id, mode, matiere, matiere_id, notion, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    roadmap_uuid,
                    student_id,
                    request.mode,
                    request.matiere,
                    request.matiere_id,
                    request.notion,
                    RoadmapJobStatus.pending.value,
                    now,
                    now,
                ),
            )
            roadmap_id = cur.lastrowid

            await cur.execute(
                """
                INSERT INTO roadmap_jobs (uuid, student_id, roadmap_id, status, payload, progress, started_at, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    job_uuid,
                    student_id,
                    roadmap_id,
                    RoadmapJobStatus.pending.value,
                    json.dumps(payload, ensure_ascii=False),
                    json.dumps({"stage": "pending"}),
                    now,
                    now,
                    now,
                ),
            )
            job_id = cur.lastrowid

    return {
        "job_id": job_id,
        "job_uuid": job_uuid,
        "roadmap_id": roadmap_id,
        "roadmap_uuid": roadmap_uuid,
    }


async def fetch_job_status(job_uuid: str) -> Optional[Dict[str, Any]]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool MySQL indisponible")

    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(
                """
                SELECT j.*, r.uuid as roadmap_uuid
                FROM roadmap_jobs j
                LEFT JOIN roadmaps r ON r.id = j.roadmap_id
                WHERE j.uuid = %s
                """,
                (job_uuid,),
            )
            job = await cur.fetchone()

            if not job:
                return None

            job["payload"] = _parse_json_field(job.get("payload"))
            job["progress"] = _parse_json_field(job.get("progress"))
            return job


async def fetch_roadmap_detail(roadmap_uuid: str) -> Optional[Dict[str, Any]]:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool MySQL indisponible")

    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute("SELECT * FROM roadmaps WHERE uuid = %s", (roadmap_uuid,))
            roadmap = await cur.fetchone()
            if not roadmap:
                return None

            roadmap_meta = _parse_json_field(roadmap.get("meta"))

            await cur.execute(
                "SELECT * FROM roadmap_sections WHERE roadmap_id = %s ORDER BY position ASC",
                (roadmap["id"],),
            )
            sections = await cur.fetchall()
            sections_data: List[Dict[str, Any]] = []

            for section in sections:
                await cur.execute(
                    "SELECT * FROM roadmap_resources WHERE section_id = %s ORDER BY id ASC",
                    (section["id"],),
                )
                resources = await cur.fetchall()
                resource_data = []
                for resource in resources:
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
        raise RuntimeError("Pool MySQL indisponible")

    columns = []
    params: List[Any] = []

    if status is not None:
        columns.append("status = %s")
        status_value = status.value if isinstance(status, RoadmapJobStatus) else str(status)
        params.append(status_value)
    if current_step is not None:
        columns.append("current_step = %s")
        params.append(current_step)
    if progress is not None:
        columns.append("progress = %s")
        params.append(json.dumps(progress, ensure_ascii=False))
    if celery_task_id is not None:
        columns.append("celery_task_id = %s")
        params.append(celery_task_id)
    if error_message is not None:
        columns.append("error_message = %s")
        params.append(error_message)
    if started_at is not None:
        columns.append("started_at = %s")
        params.append(_format_datetime(started_at))
    if finished_at is not None:
        columns.append("finished_at = %s")
        params.append(_format_datetime(finished_at))

    if not columns:
        return

    columns.append("updated_at = %s")
    params.append(_now_str())

    params.append(job_uuid)

    query = f"UPDATE roadmap_jobs SET {', '.join(columns)} WHERE uuid = %s"

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(query, params)


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
        raise RuntimeError("Pool MySQL indisponible")

    columns = []
    params: List[Any] = []

    if status is not None:
        columns.append("status = %s")
        params.append(status.value if isinstance(status, RoadmapJobStatus) else str(status))
    if summary is not None:
        columns.append("summary = %s")
        params.append(summary)
    if meta is not None:
        columns.append("meta = %s")
        params.append(json.dumps(meta, ensure_ascii=False))
    if finished_at is not None:
        columns.append("finished_at = %s")
        params.append(_format_datetime(finished_at))

    if not columns:
        return

    columns.append("updated_at = %s")
    params.append(_now_str())

    params.append(roadmap_id)

    query = f"UPDATE roadmaps SET {', '.join(columns)} WHERE id = %s"

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(query, params)


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
        raise RuntimeError("Pool MySQL indisponible")

    metadata_json = json.dumps(metadata or {}, ensure_ascii=False)
    now = _now_str()

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                INSERT INTO roadmap_sections (roadmap_id, title, description, position, period_label, metadata, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    roadmap_id,
                    title,
                    description,
                    position,
                    period_label,
                    metadata_json,
                    now,
                    now,
                ),
            )
            return cur.lastrowid


async def insert_resource(
    section_id: int,
    resource: Dict[str, Any],
) -> int:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool MySQL indisponible")

    metadata_json = json.dumps(resource.get("metadata", {}), ensure_ascii=False)
    now = _now_str()

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                INSERT INTO roadmap_resources
                (section_id, resource_type, title, url, source, thumbnail_url, duration_seconds, score, level, summary, transcript, status, metadata, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
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
                ),
            )
    return cur.lastrowid


async def clear_roadmap_sections(roadmap_id: int) -> None:
    pool = await get_db_pool()
    if not pool:
        raise RuntimeError("Pool MySQL indisponible")

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                "DELETE rr FROM roadmap_resources rr "
                "INNER JOIN roadmap_sections rs ON rs.id = rr.section_id "
                "WHERE rs.roadmap_id = %s",
                (roadmap_id,),
            )
            await cur.execute(
                "DELETE FROM roadmap_sections WHERE roadmap_id = %s",
                (roadmap_id,),
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
