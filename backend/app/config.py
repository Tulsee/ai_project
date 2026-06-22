"""Application configuration.

Values can be overridden with environment variables (prefixed ``AI_``) so the
same code runs in dev and prod without edits.
"""
from __future__ import annotations

import os
from pathlib import Path


class Config:
    APP_NAME: str = "AI-Solution API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Where JSON data files live (backend/data). Created automatically.
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"

    # Auth — change AI_SECRET_KEY in production!
    SECRET_KEY: str = os.getenv("AI_SECRET_KEY", "dev-secret-change-me")
    TOKEN_EXPIRE_MINUTES: int = int(os.getenv("AI_TOKEN_EXPIRE_MINUTES", "720"))

    # Default admin account created on first run.
    DEFAULT_ADMIN_USER: str = os.getenv("AI_ADMIN_USER", "admin")
    DEFAULT_ADMIN_PASSWORD: str = os.getenv("AI_ADMIN_PASSWORD", "admin123")

    # CORS — the Vite dev server origins.
    CORS_ORIGINS: list[str] = os.getenv(
        "AI_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")


config = Config()
