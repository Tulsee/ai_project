"""Chatbot endpoints: FAQ list + a keyword-matching answer endpoint."""
from __future__ import annotations

from fastapi import APIRouter

from ..faq import FAQ, FALLBACK, find_answer
from ..schemas import ChatIn, ChatOut

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/faq")
def get_faq():
    return FAQ


@router.post("", response_model=ChatOut)
def chat(body: ChatIn):
    answer = find_answer(body.message)
    return ChatOut(answer=answer or FALLBACK, matched=answer is not None)
