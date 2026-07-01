"""Shared API helpers."""
from fastapi import Request


async def json_body(request: Request) -> dict:
    """Return {} on empty or malformed JSON body."""
    try:
        data = await request.json()
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}