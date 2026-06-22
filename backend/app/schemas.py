"""Pydantic request/response models (Pydantic v2)."""
from __future__ import annotations

import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


# ── Collections ────────────────────────────────────────────────────────────────
class ServiceIn(BaseModel):
    icon: str = "⚡"
    badge: str = ""
    title: str
    color: str = "#0072CE"
    desc: str = ""
    features: list[str] = Field(default_factory=list)


class EventIn(BaseModel):
    icon: str = "📅"
    title: str
    date: str = ""
    location: str = ""
    desc: str = ""
    badge: str = "Coming Soon"
    badgeColor: str = "#d97706"


class PhotoIn(BaseModel):
    icon: str = "🖼️"
    title: str
    subtitle: str = ""
    gradient: str = "linear-gradient(135deg, #0A1F3D, #0072CE)"


class BlogIn(BaseModel):
    title: str
    category: str = ""
    categoryColor: str = "#0072CE"
    borderColor: str = "#0072CE"
    excerpt: str = ""
    author: str = ""
    date: str = ""
    readTime: str = "5 min read"


# ── Inquiries ──────────────────────────────────────────────────────────────────
class InquiryIn(BaseModel):
    name: str
    email: str
    phone: str = ""
    company: str = ""
    country: str = ""
    jobTitle: str = ""
    details: str = ""
    date: Optional[str] = None  # server fills this if omitted

    @field_validator("email")
    @classmethod
    def _valid_email(cls, v: str) -> str:
        if not _EMAIL_RE.match(v.strip()):
            raise ValueError("Enter a valid email address")
        return v.strip()


# ── Settings ───────────────────────────────────────────────────────────────────
class SettingsIn(BaseModel):
    """Partial update — every field optional."""
    siteName: Optional[str] = None
    logoLetter: Optional[str] = None
    tagline: Optional[str] = None
    primaryColor: Optional[str] = None
    darkColor: Optional[str] = None
    accentColor: Optional[str] = None


# ── Auth ───────────────────────────────────────────────────────────────────────
class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


class ChangeCredentialsIn(BaseModel):
    current_password: str
    new_username: Optional[str] = None
    new_password: Optional[str] = None


# ── Chat ───────────────────────────────────────────────────────────────────────
class ChatIn(BaseModel):
    message: str


class ChatOut(BaseModel):
    answer: str
    matched: bool
