"""Authentication: login + admin account / password management."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from .. import storage
from ..schemas import ChangeCredentialsIn, LoginIn, TokenOut
from ..security import create_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn):
    creds = storage.get_doc("credentials")
    if body.username != creds.get("username") or not verify_password(body.password, creds.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password.")
    return TokenOut(access_token=create_token(body.username), username=body.username)


@router.get("/me")
def me(username: str = Depends(get_current_user)):
    return {"username": username}


@router.put("/credentials")
def change_credentials(body: ChangeCredentialsIn, username: str = Depends(get_current_user)):
    creds = storage.get_doc("credentials")
    if not verify_password(body.current_password, creds.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")
    if body.new_password and len(body.new_password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be at least 6 characters.")

    patch: dict = {}
    if body.new_username:
        patch["username"] = body.new_username.strip()
    if body.new_password:
        patch["password_hash"] = hash_password(body.new_password)

    updated = storage.patch_doc("credentials", patch) if patch else creds
    return {"username": updated.get("username")}
