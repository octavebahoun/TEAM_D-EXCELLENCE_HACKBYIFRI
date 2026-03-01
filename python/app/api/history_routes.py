"""
Endpoints de l'historique IA.
Préfixe : /api/v1/history  (monté dans main.py)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from app.api.dependencies import get_current_user
from app.services import history_service

router = APIRouter()


class HistoryItem(BaseModel):
    history_id: str
    service_type: str
    filename: Optional[str] = None
    matiere: Optional[str] = None
    result_id: str
    meta: dict = {}
    created_at: str


class HistoryListResponse(BaseModel):
    total: int
    items: list[HistoryItem]


@router.get("", response_model=HistoryListResponse)
async def get_history(
    type: Optional[str] = Query(default=None, description="Filtrer par type : summary|quiz|exercise|podcast|image|chat"),
    current_user: dict = Depends(get_current_user),
):
    """Retourne l'historique IA de l'utilisateur connecté."""
    user_id = current_user["id"]
    items = history_service.get_all(user_id, service_type=type)
    return HistoryListResponse(total=len(items), items=items)


@router.delete("/{history_id}")
async def delete_history_item(
    history_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Supprime une entrée de l'historique par son ID."""
    user_id = current_user["id"]
    found = history_service.delete_entry(user_id, history_id)
    if not found:
        raise HTTPException(status_code=404, detail="Entrée introuvable")
    return {"message": "Entrée supprimée"}


@router.delete("")
async def clear_history_by_type(
    type: str = Query(..., description="Type à effacer : summary|quiz|exercise|podcast|image|chat"),
    current_user: dict = Depends(get_current_user),
):
    """Supprime toutes les entrées d'un type donné."""
    user_id = current_user["id"]
    deleted = history_service.clear_by_type(user_id, type)
    return {"message": f"{deleted} entrée(s) supprimée(s)", "deleted": deleted}
