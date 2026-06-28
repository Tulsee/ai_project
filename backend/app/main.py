"""AI-Service backend — FastAPI application entry point.

Run from the ``backend`` directory:

    uvicorn app.main:app --reload

Interactive API docs: http://127.0.0.1:8000/docs
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import storage
from .config import config
from .routers import auth, chat, collections, dashboard, inquiries, settings, uploads


def _route_app_logs_to_uvicorn() -> None:
    """Make ``app.*`` loggers render through uvicorn's handlers so messages
    (e.g. table creation / seeding) appear in the same terminal output."""
    uvicorn_logger = logging.getLogger("uvicorn")
    app_logger = logging.getLogger("app")
    if uvicorn_logger.handlers:
        app_logger.handlers = uvicorn_logger.handlers
        app_logger.propagate = False
    app_logger.setLevel(logging.INFO)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create the SQLite database and load seed content on first launch.
    _route_app_logs_to_uvicorn()
    storage.ensure_seeded()
    yield


app = FastAPI(title=config.APP_NAME, version=config.VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root():
    return {"name": config.APP_NAME, "version": config.VERSION, "docs": "/docs"}


@app.get(f"{config.API_PREFIX}/health", tags=["meta"])
def health():
    return {"status": "ok"}


# Mount every router under /api
for r in (
    auth.router,
    collections.services_router,
    collections.events_router,
    collections.photos_router,
    collections.blogs_router,
    collections.testimonials_router,
    inquiries.router,
    settings.router,
    dashboard.router,
    chat.router,
    uploads.router,
):
    app.include_router(r, prefix=config.API_PREFIX)

# Serve uploaded images as static files (e.g. /api/uploads/<filename>).
config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount(
    config.UPLOAD_URL_PREFIX, StaticFiles(directory=config.UPLOAD_DIR), name="uploads"
)
