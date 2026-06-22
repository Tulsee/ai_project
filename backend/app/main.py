"""AI-Solution backend — FastAPI application entry point.

Run from the ``backend`` directory:

    uvicorn app.main:app --reload

Interactive API docs: http://127.0.0.1:8000/docs
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import storage
from .config import config
from .routers import auth, chat, collections, dashboard, inquiries, settings


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create data files with seed content on first launch.
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
    inquiries.router,
    settings.router,
    dashboard.router,
    chat.router,
):
    app.include_router(r, prefix=config.API_PREFIX)
