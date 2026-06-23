"""Generic CRUD routers for the schemaless content collections.

Reads are public (the website needs them); writes require a valid admin token.
A single factory builds an identical router for services, events, photos & blogs.

NOTE: this module deliberately does NOT use ``from __future__ import annotations``.
The factory annotates the request body as ``payload: model`` where ``model`` is a
runtime variable; FastAPI must evaluate that annotation to the real Pydantic class
(not a string) to recognise it as a request body rather than a query parameter.
"""
from typing import Type

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from .. import storage
from ..schemas import BlogIn, EventIn, PhotoIn, ServiceIn, TestimonialIn
from ..security import get_current_user


def _make_router(name: str, model: Type[BaseModel]) -> APIRouter:
    router = APIRouter(prefix=f"/{name}", tags=[name])

    @router.get("")
    def list_all():
        return storage.list_items(name)

    @router.get("/{item_id}")
    def get_one(item_id: str):
        item = storage.get_item(name, item_id)
        if item is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"{name[:-1].title()} not found")
        return item

    @router.post("", status_code=status.HTTP_201_CREATED)
    def create(payload: model, _: str = Depends(get_current_user)):  # type: ignore[valid-type]
        return storage.create_item(name, payload.model_dump())

    @router.put("/{item_id}")
    def update(item_id: str, payload: model, _: str = Depends(get_current_user)):  # type: ignore[valid-type]
        updated = storage.update_item(name, item_id, payload.model_dump())
        if updated is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"{name[:-1].title()} not found")
        return updated

    @router.delete("/{item_id}")
    def delete(item_id: str, _: str = Depends(get_current_user)):
        if not storage.delete_item(name, item_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"{name[:-1].title()} not found")
        return {"ok": True}

    return router


services_router = _make_router("services", ServiceIn)
events_router = _make_router("events", EventIn)
photos_router = _make_router("photos", PhotoIn)
blogs_router = _make_router("blogs", BlogIn)
testimonials_router = _make_router("testimonials", TestimonialIn)
