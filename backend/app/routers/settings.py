"""Site settings (logo, name, tagline, theme colors).

GET is public (navbar/footer/chatbot read it); PUT requires an admin token.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends

from .. import storage
from ..schemas import SettingsIn
from ..security import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def get_settings():
    return storage.get_doc("settings")


@router.put("")
def update_settings(body: SettingsIn, _: str = Depends(get_current_user)):
    # Only apply fields the client actually sent (partial update).
    patch = {k: v for k, v in body.model_dump().items() if v is not None}
    return storage.patch_doc("settings", patch)
