"""Background asyncio loop so Flask can call the vendored Zeus async stack."""
import asyncio
import atexit
import threading

from travel_planner.paths import PROJECT_ROOT
from travel_planner.zeus_config import patch_zeus_paths

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


def startup() -> None:
    global _started
    if _started:
        return
    _ensure_loop()
    patch_zeus_paths()
    (PROJECT_ROOT / "data").mkdir(parents=True, exist_ok=True)

    from python3.http_client import init_http
    from python3.storage.chat_store import load_chats_from_jsonl

    run_coro(init_http())
    load_chats_from_jsonl()
    _started = True


def shutdown() -> None:
    if not _started:
        return
    from python3.http_client import close_http

    try:
        run_coro(close_http(), timeout=10)
    except Exception:
        pass


atexit.register(shutdown)