"""Customer inquiries.

POST is public (the contact form and chatbot submit here). Listing, deleting and
CSV export require an admin token.
"""
from __future__ import annotations

import csv
import io
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse

from .. import storage
from ..schemas import InquiryIn
from ..security import get_current_user

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.get("")
def list_inquiries(_: str = Depends(get_current_user)):
    # newest first
    return list(reversed(storage.list_items("inquiries")))


@router.post("", status_code=status.HTTP_201_CREATED)
def create_inquiry(payload: InquiryIn):
    data = payload.model_dump()
    if not data.get("date"):
        data["date"] = datetime.now(timezone.utc).isoformat()
    return storage.create_item("inquiries", data)


@router.get("/export.csv")
def export_csv(_: str = Depends(get_current_user)):
    fields = ["name", "email", "phone", "company", "country", "jobTitle", "details", "date"]
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Name", "Email", "Phone", "Company", "Country", "Job Title", "Details", "Date"])
    for q in storage.list_items("inquiries"):
        writer.writerow([q.get(f, "") for f in fields])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inquiries.csv"},
    )


@router.delete("")
def clear_inquiries(_: str = Depends(get_current_user)):
    storage.clear_items("inquiries")
    return {"ok": True}


@router.delete("/{item_id}")
def delete_inquiry(item_id: str, _: str = Depends(get_current_user)):
    if not storage.delete_item("inquiries", item_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    return {"ok": True}
