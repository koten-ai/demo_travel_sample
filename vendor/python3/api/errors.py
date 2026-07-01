"""JSON-only error responses for /api/* routes."""
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.types import ASGIApp, Receive, Scope, Send

from python3.logging_setup import logger


def _is_api_path(path: str) -> bool:
    return path.startswith("/api/")


def _json_error(message: str, status_code: int, **extra) -> JSONResponse:
    return JSONResponse({"error": message, **extra}, status_code=status_code)


async def api_http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if not _is_api_path(request.url.path):
        from fastapi.exception_handlers import http_exception_handler

        return await http_exception_handler(request, exc)
    detail = exc.detail
    if isinstance(detail, str):
        return _json_error(detail, exc.status_code)
    return JSONResponse({"error": detail}, status_code=exc.status_code)


async def api_validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    if not _is_api_path(request.url.path):
        from fastapi.exception_handlers import request_validation_exception_handler

        return await request_validation_exception_handler(request, exc)
    return JSONResponse({"error": "validation error", "detail": exc.errors()}, status_code=422)


async def api_unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    if not _is_api_path(request.url.path):
        raise exc
    logger.exception("unhandled API exception: %s %s", request.method, request.url.path)
    return _json_error("internal server error", 500)


class ApiJsonAcceptMiddleware:
    """Force Accept: application/json on /api/* so framework errors stay JSON."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http" and _is_api_path(scope.get("path", "")):
            headers = [(k, v) for k, v in scope.get("headers", []) if k.lower() != b"accept"]
            headers.append((b"accept", b"application/json"))
            scope = {**scope, "headers": headers}
        await self.app(scope, receive, send)