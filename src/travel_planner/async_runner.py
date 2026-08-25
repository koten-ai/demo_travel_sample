"""Background asyncio loop + process-scoped ZeusRuntime lifecycle."""

from __future__ import annotations

import atexit
import asyncio
import logging
import threading
from typing import TYPE_CHECKING

from travel_planner.paths import PROJECT_ROOT
from travel_planner.zeus_config import configure_paths

if TYPE_CHECKING:
    from zeus_client import ZeusRuntime

logger = logging.getLogger("travel_planner")

_loop: asyncio.AbstractEventLoop | None = None
_started = False
_runtime: ZeusRuntime | None = None


def _ensure_loop() -> asyncio.AbstractEventLoop:
    global _loop
    if _loop is not None:
        return _loop

    loop = asyncio.new_event_loop()

    def run() -> None:
        asyncio.set_event_loop(loop)
        loop.run_forever()

    threading.Thread(target=run, name="async-runner", daemon=True).start()
    _loop = loop
    return loop


def run_coro(coro, timeout: float = 600):
    """Run an async coroutine on the persistent background loop."""
    loop = _ensure_loop()
    future = asyncio.run_coroutine_threadsafe(coro, loop)
    return future.result(timeout=timeout)


def get_runtime() -> ZeusRuntime:
    if _runtime is None:
        raise RuntimeError("runtime not started")
    return _runtime


def set_runtime_for_tests(rt: ZeusRuntime | None) -> None:
    """Test helper — inject or clear the process-scoped runtime."""
    global _runtime
    _runtime = rt


async def _startup_async(rt: ZeusRuntime) -> None:
    from travel_planner.runtime_factory import load_app_config_dict

    raw = load_app_config_dict()
    sync_cfg = raw.get("chat_requests_sync") or {}
    if sync_cfg.get("on_startup"):
        try:
            result = await rt.catalog.sync()
            synced = getattr(result, "synced", None) or []
            skipped = getattr(result, "skipped", None) or []
            errors = getattr(result, "errors", None) or []
            if synced:
                logger.info("startup catalog sync: updated %d catalog(s)", len(synced))
            if skipped:
                logger.info(
                    "startup catalog sync: skipped %d unchanged catalog(s)",
                    len(skipped),
                )
            if errors:
                logger.warning(
                    "startup catalog sync: %d error(s): %s",
                    len(errors),
                    errors,
                )
        except Exception as e:  # soft-fail like the previous V1 runner
            logger.warning("startup catalog sync failed: %s", e)

    from travel_planner.chat_store import load_chats_from_jsonl

    load_chats_from_jsonl()


def startup() -> None:
    global _started, _runtime
    if _started:
        return
    _ensure_loop()
    configure_paths()
    (PROJECT_ROOT / "data").mkdir(parents=True, exist_ok=True)

    from travel_planner.runtime_factory import build_runtime

    _runtime = build_runtime()
    run_coro(_startup_async(_runtime))
    _started = True


def shutdown() -> None:
    global _started, _runtime
    if not _started:
        return
    rt = _runtime
    _runtime = None
    _started = False
    if rt is None:
        return
    try:
        run_coro(rt.aclose(), timeout=10)
    except Exception:
        pass


atexit.register(shutdown)
