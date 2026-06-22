"""Analytics for the admin dashboard."""
from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from .. import storage
from ..security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _parse(date_str: str):
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


@router.get("/stats")
def stats(_: str = Depends(get_current_user)):
    inquiries = storage.list_items("inquiries")
    now = datetime.now(timezone.utc)

    this_week = 0
    for q in inquiries:
        dt = _parse(q.get("date", ""))
        if dt and (now - dt).days < 7:
            this_week += 1

    by_country = Counter(q.get("country") for q in inquiries if q.get("country"))

    return {
        "counts": {
            "services": len(storage.list_items("services")),
            "events": len(storage.list_items("events")),
            "photos": len(storage.list_items("photos")),
            "blogs": len(storage.list_items("blogs")),
            "inquiries": len(inquiries),
        },
        "inquiriesThisWeek": this_week,
        "recentInquiries": list(reversed(inquiries))[:5],
        "byCountry": [{"country": c, "count": n} for c, n in by_country.most_common(6)],
    }
