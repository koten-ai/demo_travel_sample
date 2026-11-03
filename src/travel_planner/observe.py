"""Observe-only middleware for the six 2.5 agent-loop moments.

Logs safe fields at DEBUG. Does not change the turn or ``ctx.data``.
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from zeus_client.application.middleware import MiddlewareContext, NoopMiddleware

logger = logging.getLogger("travel_planner")

_SAFE_FIELDS = ("tool_calls", "verb", "status", "answer_len")


def _emit(event: str, ctx: MiddlewareContext, **fields: object) -> None:
    parts = [f"event={event}", f"turn_id={ctx.turn_id}", f"round={ctx.round}"]
    for key in _SAFE_FIELDS:
        if key in fields:
            parts.append(f"{key}={fields[key]}")
    logger.debug("observe %s", " ".join(parts))


def _tool_call_count(response: Mapping[str, Any]) -> int:
    calls = response.get("tool_calls")
    if calls is None or isinstance(calls, (str, bytes, Mapping)):
        return 0
    try:
        return len(calls)
    except TypeError:
        return 0


@dataclass
class ObserveMiddleware(NoopMiddleware):
    """Log loop moments. ``critical`` is false so a log failure cannot fail the turn."""

    name: str = "observe"
    critical: bool = False

    async def on_turn_start(self, ctx: MiddlewareContext) -> None:
        _emit("on_turn_start", ctx)

    async def before_llm(self, ctx: MiddlewareContext, messages: list[dict[str, Any]]) -> None:
        _emit("before_llm", ctx)

    async def after_llm(self, ctx: MiddlewareContext, response: Mapping[str, Any]) -> None:
        _emit("after_llm", ctx, tool_calls=_tool_call_count(response))

    async def before_zeus(
        self, ctx: MiddlewareContext, name: str, args: dict[str, Any]
    ) -> dict[str, Any]:
        _emit("before_zeus", ctx, verb=name)
        return args

    async def after_zeus(
        self,
        ctx: MiddlewareContext,
        name: str,
        status: int,
        body: Mapping[str, Any] | str | None,
    ) -> None:
        _emit("after_zeus", ctx, verb=name, status=status)

    async def on_turn_end(self, ctx: MiddlewareContext, answer: str) -> None:
        answer_len = len(answer) if isinstance(answer, str) else 0
        _emit("on_turn_end", ctx, answer_len=answer_len)
