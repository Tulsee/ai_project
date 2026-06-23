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
    title: str
    subtitle: str = ""
    image: str = ""  # URL of the gallery photo


class BlogIn(BaseModel):
    title: str
    category: str = ""
    categoryColor: str = "#0072CE"
    borderColor: str = "#0072CE"
    excerpt: str = ""
    author: str = ""
    authorImage: str = ""  # URL of the author's avatar
    date: str = ""
    readTime: str = "5 min read"


# ── Testimonials ───────────────────────────────────────────────────────────────
class TestimonialIn(BaseModel):
    name: str
    title: str = ""
    company: str = ""
    country: str = ""
    rating: int = 5
    category: str = ""
    image: str = ""  # URL of the client's photo
    text: str = ""

    @field_validator("rating")
    @classmethod
    def _clamp_rating(cls, v: int) -> int:
        return max(1, min(5, v))


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
    logoType: Optional[str] = None  # "text" | "image"
    logoLetter: Optional[str] = None
    logoImage: Optional[str] = None
    tagline: Optional[str] = None
    primaryColor: Optional[str] = None
    darkColor: Optional[str] = None
    accentColor: Optional[str] = None
    # Per-page banner background images
    bannerHome: Optional[str] = None
    bannerSolutions: Optional[str] = None
    bannerIndustries: Optional[str] = None
    bannerTestimonials: Optional[str] = None
    bannerArticles: Optional[str] = None
    bannerGallery: Optional[str] = None
    # Per-page hero text + text colour: { page: { badge, title, subtitle, textColor } }
    heroes: Optional[dict] = None


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
