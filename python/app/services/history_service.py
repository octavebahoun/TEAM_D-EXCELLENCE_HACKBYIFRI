"""
Service d'historique IA — stockage JSON par utilisateur.
Chemin : generated/history/user_{user_id}.json
"""
import json
import os
import uuid
from datetime import datetime
from typing import Optional

from app.core.config import settings

HISTORY_DIR = os.path.join(settings.GENERATED_DIR, "history")
os.makedirs(HISTORY_DIR, exist_ok=True)


def _user_file(user_id: int) -> str:
    return os.path.join(HISTORY_DIR, f"user_{user_id}.json")


def _load(user_id: int) -> list:
    path = _user_file(user_id)
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _save_file(user_id: int, entries: list) -> None:
    path = _user_file(user_id)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


def save(
    user_id: int,
    service_type: str,
    filename: Optional[str],
    matiere: Optional[str],
    result_id: str,
    meta: Optional[dict] = None,
) -> dict:
    """Ajoute une entrée d'historique pour l'utilisateur (plus récent en premier)."""
    entries = _load(user_id)
    entry = {
        "history_id": str(uuid.uuid4()),
        "service_type": service_type,
        "filename": filename,
        "matiere": matiere,
        "result_id": result_id,
        "meta": meta or {},
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    entries.insert(0, entry)  # plus récent en premier
    _save_file(user_id, entries)
    return entry


def get_all(user_id: int, service_type: Optional[str] = None) -> list:
    """Retourne les entrées de l'historique, filtrées par type si fourni."""
    entries = _load(user_id)
    if service_type:
        entries = [e for e in entries if e.get("service_type") == service_type]
    return entries


def delete_entry(user_id: int, history_id: str) -> bool:
    """Supprime une entrée par son history_id. Retourne True si trouvée."""
    entries = _load(user_id)
    new_entries = [e for e in entries if e.get("history_id") != history_id]
    if len(new_entries) == len(entries):
        return False
    _save_file(user_id, new_entries)
    return True


def clear_by_type(user_id: int, service_type: str) -> int:
    """Supprime toutes les entrées d'un type. Retourne le nombre supprimé."""
    entries = _load(user_id)
    new_entries = [e for e in entries if e.get("service_type") != service_type]
    deleted = len(entries) - len(new_entries)
    _save_file(user_id, new_entries)
    return deleted
