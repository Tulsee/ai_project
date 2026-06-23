"""SQLite-backed data store.

Each collection (services, events, photos, blogs, inquiries) is stored as one row
per document in the ``documents`` table, keyed by ``(collection, id)`` with the
whole document serialised as JSON in the ``data`` column. Documents therefore
stay schemaless — exactly the shapes the frontend's localStorage layer used —
while we get a real database with atomic writes and concurrent-safe access.

Single-object docs (``settings``, ``credentials``) live in the ``docs`` table.

The database file (``config.DB_PATH``) and its tables are created automatically
on first run, then seeded from ``seed.py`` (see ``ensure_seeded``). The router
code only depends on the public functions below, so this module can be replaced
again without touching the API.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import uuid
from typing import Any

from . import seed
from .config import config

_lock = threading.RLock()
_conn: sqlite3.Connection | None = None

COLLECTIONS = ("services", "events", "photos", "blogs", "testimonials", "inquiries")
_SEED = {
    "services": seed.SERVICES,
    "events": seed.EVENTS,
    "photos": seed.PHOTOS,
    "blogs": seed.BLOGS,
    "testimonials": seed.TESTIMONIALS,
    "inquiries": seed.INQUIRIES,
}


# ── Connection & schema ─────────────────────────────────────────────────────────
def _connect() -> sqlite3.Connection:
    """Return the shared connection, opening the DB and creating tables on first
    use. The file is created automatically if it does not exist."""
    global _conn
    if _conn is None:
        config.DATA_DIR.mkdir(parents=True, exist_ok=True)
        # check_same_thread=False is safe here because every access goes through
        # the module-level RLock below.
        _conn = sqlite3.connect(str(config.DB_PATH), check_same_thread=False)
        _conn.execute("PRAGMA journal_mode=WAL")
        _conn.execute(
            "CREATE TABLE IF NOT EXISTS documents ("
            "  collection TEXT NOT NULL,"
            "  id         TEXT NOT NULL,"
            "  data       TEXT NOT NULL,"
            "  PRIMARY KEY (collection, id)"
            ")"
        )
        _conn.execute(
            "CREATE TABLE IF NOT EXISTS docs ("
            "  name TEXT PRIMARY KEY,"
            "  data TEXT NOT NULL"
            ")"
        )
        _conn.commit()
    return _conn


def _new_id() -> str:
    return uuid.uuid4().hex


def _doc_exists(name: str) -> bool:
    cur = _connect().execute("SELECT 1 FROM docs WHERE name = ?", (name,))
    return cur.fetchone() is not None


# ── Seeding ────────────────────────────────────────────────────────────────────
def ensure_seeded() -> None:
    """Create the SQLite database & tables (if missing) and load seed data on the
    first run. Idempotent: an already-seeded database is left untouched.

    The presence of the ``credentials`` doc marks a database as seeded — no
    endpoint ever deletes it, so clearing a collection won't trigger a re-seed.
    """
    with _lock:
        conn = _connect()  # opens/creates the file and tables
        already_seeded = _doc_exists("credentials")

        if not already_seeded:
            for name in COLLECTIONS:
                for item in _SEED[name]:
                    doc = {**item, "id": _new_id()}
                    conn.execute(
                        "INSERT INTO documents (collection, id, data) VALUES (?, ?, ?)",
                        (name, doc["id"], json.dumps(doc, ensure_ascii=False)),
                    )

        if not _doc_exists("settings"):
            set_doc("settings", seed.SETTINGS)
        if not _doc_exists("credentials"):
            set_doc("credentials", seed.default_credentials(
                config.DEFAULT_ADMIN_USER, config.DEFAULT_ADMIN_PASSWORD))

        conn.commit()


# ── Collection CRUD ────────────────────────────────────────────────────────────
def list_items(name: str) -> list[dict]:
    with _lock:
        cur = _connect().execute(
            "SELECT data FROM documents WHERE collection = ? ORDER BY rowid",
            (name,),
        )
        return [json.loads(row[0]) for row in cur.fetchall()]


def get_item(name: str, item_id: str) -> dict | None:
    with _lock:
        cur = _connect().execute(
            "SELECT data FROM documents WHERE collection = ? AND id = ?",
            (name, item_id),
        )
        row = cur.fetchone()
        return json.loads(row[0]) if row else None


def create_item(name: str, data: dict) -> dict:
    with _lock:
        conn = _connect()
        item = {**data, "id": _new_id()}
        conn.execute(
            "INSERT INTO documents (collection, id, data) VALUES (?, ?, ?)",
            (name, item["id"], json.dumps(item, ensure_ascii=False)),
        )
        conn.commit()
        return item


def update_item(name: str, item_id: str, data: dict) -> dict | None:
    with _lock:
        conn = _connect()
        item = {**data, "id": item_id}
        cur = conn.execute(
            "UPDATE documents SET data = ? WHERE collection = ? AND id = ?",
            (json.dumps(item, ensure_ascii=False), name, item_id),
        )
        conn.commit()
        return item if cur.rowcount > 0 else None


def delete_item(name: str, item_id: str) -> bool:
    with _lock:
        conn = _connect()
        cur = conn.execute(
            "DELETE FROM documents WHERE collection = ? AND id = ?",
            (name, item_id),
        )
        conn.commit()
        return cur.rowcount > 0


def clear_items(name: str) -> None:
    with _lock:
        conn = _connect()
        conn.execute("DELETE FROM documents WHERE collection = ?", (name,))
        conn.commit()


# ── Single-object docs (settings / credentials) ────────────────────────────────
def get_doc(name: str, fallback: dict | None = None) -> dict:
    with _lock:
        cur = _connect().execute("SELECT data FROM docs WHERE name = ?", (name,))
        row = cur.fetchone()
        return json.loads(row[0]) if row else (fallback or {})


def patch_doc(name: str, patch: dict) -> dict:
    with _lock:
        doc = get_doc(name)
        doc.update(patch)
        return set_doc(name, doc)


def set_doc(name: str, data: Any) -> Any:
    with _lock:
        conn = _connect()
        conn.execute(
            "INSERT INTO docs (name, data) VALUES (?, ?) "
            "ON CONFLICT(name) DO UPDATE SET data = excluded.data",
            (name, json.dumps(data, ensure_ascii=False)),
        )
        conn.commit()
        return data
