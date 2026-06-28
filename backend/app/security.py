"""Authentication helpers built on the standard library only.

- Passwords are hashed with PBKDF2-HMAC-SHA256.
- Sessions use a stateless, HMAC-signed token (a minimal JWT-style scheme):
  ``base64url(payload) + "." + base64url(hmac_sha256(payload))``.

No third-party crypto packages are required.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import secrets
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import config

_PBKDF2_ITERATIONS = 200_000
_bearer = HTTPBearer(auto_error=False)
# At least 8 chars with one lowercase, one uppercase, one digit, one special char.
_PASSWORD_POLICY = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")


# ── Password hashing ──────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${_PBKDF2_ITERATIONS}${_b64e(salt)}${_b64e(dk)}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iters, salt_b64, hash_b64 = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), _b64d(salt_b64), int(iters))
        return hmac.compare_digest(dk, _b64d(hash_b64))
    except (ValueError, TypeError):
        return False


def password_meets_policy(password: str) -> bool:
    return bool(_PASSWORD_POLICY.match(password))


# ── Tokens ────────────────────────────────────────────────────────────────────
def create_token(username: str) -> str:
    payload = {"sub": username, "exp": int(time.time()) + config.TOKEN_EXPIRE_MINUTES * 60}
    body = _b64e(json.dumps(payload, separators=(",", ":")).encode())
    return f"{body}.{_sign(body)}"


def decode_token(token: str) -> str:
    try:
        body, sig = token.split(".")
    except ValueError:
        raise _credentials_error()
    if not hmac.compare_digest(sig, _sign(body)):
        raise _credentials_error()
    payload = json.loads(_b64d(body))
    if payload.get("exp", 0) < int(time.time()):
        raise _credentials_error("Token expired")
    return payload["sub"]


# ── FastAPI dependency ─────────────────────────────────────────────────────────
def get_current_user(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> str:
    if creds is None or creds.scheme.lower() != "bearer":
        raise _credentials_error("Not authenticated")
    return decode_token(creds.credentials)


# ── Internal helpers ───────────────────────────────────────────────────────────
def _sign(body: str) -> str:
    mac = hmac.new(config.SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest()
    return _b64e(mac)


def _b64e(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _b64d(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _credentials_error(detail: str = "Invalid authentication credentials") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )
