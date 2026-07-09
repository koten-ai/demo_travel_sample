"""Background asyncio loop so Flask can call the zeus_client async stack."""
import asyncio
import atexit
import threading

from travel_planner.paths import PROJECT_ROOT
from travel_planner.zeus_config import configure_zeus_client

_loop: asyncio.AbstractEventLoop | None = None
_started = False


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


def _sync_chat_requests_on_startup(cfg: dict) -> None:
    """Pull chat_request catalogs from Zeus when config enables on_startup."""
    sync_cfg = cfg.get("chat_requests_sync") or {}
    if not sync_cfg.get("on_startup"):
        return

    from zeus_client import logger, sync_chat_requests

    try:
        result = run_coro(sync_chat_requests(cfg))
    except Exception as e:
        logger.warning("startup chat_requests sync failed: %s", e)
        return

    if result.synced:
        logger.info(
            "startup chat_requests sync: updated %d catalog(s)",
            len(result.synced),
        )
    if result.skipped:
        logger.info(
            "startup chat_requests sync: skipped %d unchanged catalog(s)",
            len(result.skipped),
        )
    if result.errors:
        logger.warning(
            "startup chat_requests sync: %d error(s): %s",
            len(result.errors),
            result.errors,
        )


def startup() -> None:
    global _started
    if _started:
        return
    _ensure_loop()
    configure_zeus_client()
    (PROJECT_ROOT / "data").mkdir(parents=True, exist_ok=True)

    from zeus_client import close_http, init_http, load_config

    from travel_planner.chat_store import load_chats_from_jsonl

    run_coro(init_http())
    _sync_chat_requests_on_startup(run_coro(load_config()))
    load_chats_from_jsonl()
    _started = True


def shutdown() -> None:
    if not _started:
        return
    from zeus_client import close_http

    try:
        run_coro(close_http(), timeout=10)
    except Exception:
        pass


atexit.register(shutdown)