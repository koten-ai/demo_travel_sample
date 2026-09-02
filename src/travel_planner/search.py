"""Travel search via zeus_client ZeusRuntime.agent.run_turn."""

from __future__ import annotations

import logging
import time
import uuid
from typing import Any

import httpx
from zeus_client import TurnStatus, ZeusClientError

from travel_planner.answer_parser import parse_markdown_answer
from travel_planner.async_runner import get_runtime, run_coro
from travel_planner.chat_store import CHATS, chat_lock, persist_chat
from travel_planner.tool_order import build_tool_order
from travel_planner.turn_mapper import (
    apply_session_to_chat,
    prior_messages_from_turns,
    raw_rows_for_structured,
    results_waterfall,
    session_handle_from_chat,
    structured_response_payload,
    trace_payload,
    user_answer,
)

logger = logging.getLogger("travel_planner")

TRAVEL_PROMPT_PREFIX = (
    "Find travel destinations that match these preferences. "
    "Use Zeus search, find, or agent tools as needed to retrieve real destination data. "
    "Prefer results that include name, description, and image when available.\n\n"
    "User preferences:\n"
)


def user_message_for_mode(query: str, mode: str | None) -> str:
    """Analytics catalogs already instruct verb use; do not wrap with booking copy."""
    q = (query or "").strip()
    if (mode or "").strip().lower() == "analytics":
        return q
    return TRAVEL_PROMPT_PREFIX + q


async def _search_async(
    query: str, chat_id: str | None, *, rewind: bool = False
) -> dict[str, Any]:
    rt = get_runtime()
    cfg = rt.config
    target = cfg.target
    settings = cfg.settings

    chat_id = chat_id or ("travel_" + uuid.uuid4().hex[:12])
    message = user_message_for_mode(query, settings.mode)

    lock = await chat_lock(chat_id)
    async with lock:
        if chat_id not in CHATS:
            CHATS[chat_id] = {
                "title": query[:48],
                "created": time.time(),
                "turns": [],
                "traces": [],
                "chat_id": chat_id,
            }
        chat = CHATS[chat_id]
        chat["chat_id"] = chat_id
        prior_session = session_handle_from_chat(chat)
        prior_messages = prior_messages_from_turns(chat.get("turns"))

        # Omit chat_request so 2.3.0 AgentAPI.run_turn calls catalog.load_for_turn
        # (SCOPE BRIEF + MINI-SCHEMA merge). Do not pass a frozen body here.
        result = await rt.agent.run_turn(
            message,
            target=target,
            settings=settings,
            session=prior_session,
            prior_messages=prior_messages,
            chat_id=chat_id,
            model=cfg.llm.model,
            enable_sessions=bool(settings.durable_sessions),
            rewind=bool(rewind),
        )

        answer = user_answer(result)
        turns = list(chat.get("turns") or [])
        turns.append({"role": "user", "content": message})
        turns.append({"role": "assistant", "content": answer})
        chat["turns"] = turns[-40:]
        apply_session_to_chat(chat, result)

        trace = trace_payload(result)
        target_s = f"{target.bucket}/{target.scope}/{target.collection}"
        entry = {
            "question": query,
            "answer": answer,
            "target": target_s,
            "mode": settings.mode,
            "api_version": "v2",
            "model": cfg.llm.model,
            "provider": cfg.llm.provider,
            "trace": trace,
            "created": time.time(),
            "session_id": chat.get("zeus_session_id") or "",
            "session_round": chat.get("zeus_round") or 0,
            "contract_status": chat.get("contract_status"),
        }
        chat.setdefault("traces", []).append(entry)
        await persist_chat(chat_id)

    results = results_waterfall(result, trace, answer)
    structured_answer = parse_markdown_answer(answer)
    zeus_data = raw_rows_for_structured(trace)
    logger.info(
        "search complete chat_id=%s results=%d status=%s answer_len=%d",
        chat_id,
        len(results),
        result.status,
        len(answer or ""),
    )

    if result.status == TurnStatus.ERROR and result.error is not None:
        err_msg = result.error.message or "agent turn failed"
        return {
            "error": err_msg,
            "chat_id": chat_id,
            "status": "error",
            "rewind": bool(rewind),
        }

    return {
        "chat_id": chat_id,
        "query": query,
        "answer": answer,
        "structured_answer": structured_answer,
        "structured_response": structured_response_payload(
            result, zeus_data=zeus_data, answer=answer
        ),
        "results": results,
        "trace": trace,
        "tool_order": build_tool_order(CHATS),
        "target": target_s,
        "api_version": "v2",
        "mode": settings.mode,
        "model": cfg.llm.model,
        "provider": cfg.llm.provider,
        "zeus_connection": "default",
        "zeus_url": cfg.zeus.url,
        "session_id": chat.get("zeus_session_id") or "",
        "session_round": int(chat.get("zeus_round") or 0),
        "contract_status": chat.get("contract_status") or "none",
        "rewind": bool(rewind),
    }


def run_search(query: str, chat_id: str | None = None, *, rewind: bool = False) -> dict:
    """Sync entry point for Flask routes."""
    try:
        return run_coro(_search_async(query, chat_id, rewind=rewind))
    except RuntimeError as e:
        return {"error": str(e), "rewind": bool(rewind)}
    except ZeusClientError as e:
        msg = getattr(e, "public_message", None) or str(e)
        return {"error": msg, "rewind": bool(rewind)}
    except httpx.HTTPError as e:
        return {"error": f"network error: {e}", "rewind": bool(rewind)}
    except ValueError as e:
        return {"error": str(e), "rewind": bool(rewind)}
