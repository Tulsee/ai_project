"""A tiny thread-safe JSON-file data store.

Each collection (services, events, photos, blogs, inquiries) is a JSON array of
documents; ``settings`` and ``credentials`` are single JSON objects. This keeps
the data shapes identical to the frontend's localStorage layer and requires no
database. Swap this module for a SQLAlchemy repository when you outgrow it — the
router code only depends on the functions below.
"""
from __future__ import annotations

import json
import threading
import uuid
from pathlib import Path
from typing import Any

from . import seed
from .config import config

_lock = threading.RLock()

COLLECTIONS = ("services", "events", "photos", "blogs", "inquiries")
_SEED = {
    "services": seed.SERVICES,
    "events": seed.EVENTS,
    "photos": seed.PHOTOS,
    "blogs": seed.BLOGS,
    "inquiries": seed.INQUIRIES,
}


# ── File helpers ───────────────────────────────────────────────────────────────
def _path(name: str) -> Path:
    return config.DATA_DIR / f"{name}.json"


def _load(name: str, fallback: Any) -> Any:
    path = _path(name)
    if not path.exists():
        return fallback
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def _dump(name: str, data: Any) -> None:
    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    with _path(name).open("w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)


def _new_id() -> str:
    return uuid.uuid4().hex


# ── Seeding ────────────────────────────────────────────────────────────────────
def ensure_seeded() -> None:
    """Create data files with seed content on first run (idempotent)."""
    with _lock:
        config.DATA_DIR.mkdir(parents=True, exist_ok=True)
        for name in COLLECTIONS:
            if not _path(name).exists():
                _dump(name, [{**item, "id": _new_id()} for item in _SEED[name]])
        if not _path("settings").exists():
            _dump("settings", seed.SETTINGS)
        if not _path("credentials").exists():
            _dump("credentials", seed.default_credentials(
                config.DEFAULT_ADMIN_USER, config.DEFAULT_ADMIN_PASSWORD))


# ── Collection CRUD ────────────────────────────────────────────────────────────
def list_items(name: str) -> list[dict]:
    with _lock:
        return _load(name, [])


def get_item(name: str, item_id: str) -> dict | None:
    return next((x for x in list_items(name) if x.get("id") == item_id), None)


def create_item(name: str, data: dict) -> dict:
    with _lock:
        items = _load(name, [])
        item = {**data, "id": _new_id()}
        items.append(item)
        _dump(name, items)
        return item


def update_item(name: str, item_id: str, data: dict) -> dict | None:
    with _lock:
        items = _load(name, [])
        for i, existing in enumerate(items):
            if existing.get("id") == item_id:
                items[i] = {**data, "id": item_id}
                _dump(name, items)
                return items[i]
        return None


def delete_item(name: str, item_id: str) -> bool:
    with _lock:
        items = _load(name, [])
        kept = [x for x in items if x.get("id") != item_id]
        if len(kept) == len(items):
            return False
        _dump(name, kept)
        return True


def clear_items(name: str) -> None:
    with _lock:
        _dump(name, [])


# ── Single-object docs (settings / credentials) ────────────────────────────────
def get_doc(name: str, fallback: dict | None = None) -> dict:
    with _lock:
        return _load(name, fallback or {})


def patch_doc(name: str, patch: dict) -> dict:
    with _lock:
        doc = _load(name, {})
        doc.update(patch)
        _dump(name, doc)
        return doc


def set_doc(name: str, data: dict) -> dict:
    with _lock:
        _dump(name, data)
        return data
