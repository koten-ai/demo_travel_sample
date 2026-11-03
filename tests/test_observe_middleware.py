"""ObserveMiddleware logs the six loop moments and does not change the turn."""

from __future__ import annotations

import asyncio
import logging

from zeus_client.application.middleware import MiddlewareContext

from travel_planner.observe import ObserveMiddleware

_TURN_ID = "turn-obs-1"
_ROUND = 4
_USER = "USERTEXT-do-not-log"
_MESSAGE = "MSGBODY-do-not-log"
_CONTENT = "LLMCONTENT-do-not-log"
_USAGE = "USAGE99-do-not-log"
_ARGS = "TOOLARGS-do-not-log"
_BODY = "ZEUSBODY-do-not-log"
_ANSWER = "ANSWERTEXT-do-not-log"
_FORBIDDEN = (_USER, _MESSAGE, _CONTENT, _USAGE, _ARGS, _BODY, _ANSWER)


def test_observe_middleware_logs_six_moments_without_changing_the_turn(caplog):
    mw = ObserveMiddleware()
    assert mw.name == "observe"
    assert mw.critical is False

    data = {"existing": 1}
    ctx = MiddlewareContext(turn_id=_TURN_ID, round=_ROUND, user_msg=_USER, data=data)
    messages = [{"role": "user", "content": _MESSAGE}]
    response = {
        "content": _CONTENT,
        "usage": {"total_tokens": _USAGE},
        "tool_calls": [
            {"id": "1", "function": {"arguments": _ARGS}},
            {"id": "2", "function": {"arguments": _ARGS}},
        ],
    }
    args = {"query": _ARGS}
    body = {"rows": [_BODY]}

    async def _run():
        await mw.on_turn_start(ctx)
        await mw.before_llm(ctx, messages)
        await mw.after_llm(ctx, response)
        returned = await mw.before_zeus(ctx, "search", args)
        await mw.after_zeus(ctx, "search", 207, body)
        await mw.on_turn_end(ctx, _ANSWER)
        return returned

    with caplog.at_level(logging.DEBUG, logger="travel_planner"):
        returned = asyncio.run(_run())

    assert returned is args
    assert ctx.data is data
    assert ctx.data == {"existing": 1}
    for key in (
        "hooks_jailbreak_score",
        "hooks_must_refuse",
        "denied_verbs",
        "tool_body_override",
    ):
        assert key not in ctx.data

    messages_logged = [
        rec.getMessage()
        for rec in caplog.records
        if rec.name == "travel_planner" and rec.levelno == logging.DEBUG
    ]
    assert messages_logged == [
        f"observe event=on_turn_start turn_id={_TURN_ID} round={_ROUND}",
        f"observe event=before_llm turn_id={_TURN_ID} round={_ROUND}",
        f"observe event=after_llm turn_id={_TURN_ID} round={_ROUND} tool_calls=2",
        f"observe event=before_zeus turn_id={_TURN_ID} round={_ROUND} verb=search",
        f"observe event=after_zeus turn_id={_TURN_ID} round={_ROUND} verb=search status=207",
        f"observe event=on_turn_end turn_id={_TURN_ID} round={_ROUND} answer_len={len(_ANSWER)}",
    ]
    blob = "\n".join(messages_logged)
    for secret in _FORBIDDEN:
        assert secret not in blob
