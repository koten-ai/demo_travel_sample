"""FastAPI application factory and lifespan."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from python3.api.contract_routes import router as contract_router
from python3.api.errors import (
    ApiJsonAcceptMiddleware,
    api_http_exception_handler,
    api_unhandled_exception_handler,
    api_validation_exception_handler,
)
from python3.api.routes import router
from python3.config import _load_config_sync
from python3.constants import BASE_DIR
from python3.http_client import close_http, init_http
from python3.storage.chat_store import load_chats_from_jsonl


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown: HTTP client, chat replay, config materialize."""
    await init_http()
    load_chats_from_jsonl()
    _load_config_sync()
    try:
        yield
    finally:
        await close_http()


app = FastAPI(title="Zeus Python sample client", lifespan=lifespan)
app.add_exception_handler(StarletteHTTPException, api_http_exception_handler)
app.add_exception_handler(RequestValidationError, api_validation_exception_handler)
app.add_exception_handler(Exception, api_unhandled_exception_handler)
app.add_middleware(ApiJsonAcceptMiddleware)
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
app.include_router(router)
app.include_router(contract_router)