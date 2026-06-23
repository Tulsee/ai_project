"""Image uploads.

Admins upload an image file here (multipart/form-data); it's saved to
``config.UPLOAD_DIR`` under a random filename and the server returns its URL.
That URL is what gets stored on the document (photo image, author avatar, page
banner) — so the database keeps holding a plain string, now pointing at a file
on our own server instead of an external link.

Uploaded files are served as static content at ``config.UPLOAD_URL_PREFIX``
(see ``main.py``). Uploading requires a valid admin token.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from ..config import config
from ..security import get_current_user

router = APIRouter(prefix="/upload", tags=["uploads"])

# Allowed image content types → file extension. (SVG is intentionally excluded:
# it can carry scripts and is served same-origin.)
_ALLOWED = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}


@router.post("", status_code=status.HTTP_201_CREATED)
def upload_image(file: UploadFile, _: str = Depends(get_current_user)):
    ext = _ALLOWED.get(file.content_type or "")
    if ext is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Upload a JPG, PNG, WEBP or GIF image.",
        )

    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = config.UPLOAD_DIR / filename

    size = 0
    try:
        with dest.open("wb") as out:
            while chunk := file.file.read(1024 * 1024):
                size += len(chunk)
                if size > config.MAX_UPLOAD_BYTES:
                    raise HTTPException(
                        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File too large (max {config.MAX_UPLOAD_BYTES // (1024 * 1024)} MB).",
                    )
                out.write(chunk)
    except HTTPException:
        dest.unlink(missing_ok=True)  # don't leave a partial/oversized file behind
        raise
    finally:
        file.file.close()

    return {"url": f"{config.UPLOAD_URL_PREFIX}/{filename}", "filename": filename}
