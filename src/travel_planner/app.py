"""Flask application factory."""

from __future__ import annotations

import json

from flask import Flask, jsonify, render_template, request

from travel_planner.async_runner import startup
from travel_planner.chat_store import CHATS
from travel_planner.paths import PACKAGE_DIR, PROJECT_ROOT
from travel_planner.search import run_search
from travel_planner.tool_order import build_tool_order
from travel_planner.zeus_config import configure_paths

_app: Flask | None = None

_TRUTHY_QUERY = {"1", "true", "yes", "on"}


def debug_query_enabled(value: object | None) -> bool:
    """True when query ``debug`` is 1/true/yes/on (same set as the tracer widget)."""
    if value is True:
        return True
    if value is False or value is None:
        return False
    return str(value).strip().lower() in _TRUTHY_QUERY


def _load_build_version() -> str:
    """Read build_version from project config.json (empty string if missing)."""
    config_path = PROJECT_ROOT / "config.json"
    try:
        with open(config_path, encoding="utf-8") as f:
            data = json.load(f)
        return str(data.get("build_version") or "").strip()
    except (OSError, json.JSONDecodeError, TypeError):
        return ""


def _zeus_client_version() -> str:
    """Installed kotenai-zeus-client clock (sibling ../zeus_client_python)."""
    import zeus_client

    return str(getattr(zeus_client, "__version__", "") or "")


def create_app() -> Flask:
    """Create and configure the Flask application."""
    global _app
    if _app is not None:
        return _app

    configure_paths()
    startup()
    build_version = _load_build_version()

    app = Flask(
        __name__,
        template_folder=str(PACKAGE_DIR / "templates"),
        static_folder=str(PACKAGE_DIR / "static"),
    )

    @app.get("/")
    def index():
        return render_template(
            "index.html",
            tool_order=build_tool_order(CHATS),
            build_version=build_version,
            zeus_client_version=_zeus_client_version(),
        )

    @app.get("/api/health")
    def api_health():
        import travel_planner
        from zeus_client.domain import layer_a

        from travel_planner.runtime_factory import require_client_version

        client_version = _zeus_client_version()
        try:
            require_client_version()
            client_ok = True
        except RuntimeError:
            client_ok = False

        return jsonify(
            {
                "status": "ok" if client_ok else "degraded",
                "app_version": getattr(travel_planner, "__version__", "0.1.0"),
                "build_version": build_version,
                "zeus_client_version": client_version,
                "client_import": "zeus_client",
                "pipeline_envelope_recovery": hasattr(layer_a, "parse_pipeline_envelope"),
            }
        )

    @app.post("/api/search")
    def api_search():
        body = request.get_json(silent=True) or {}
        query = (body.get("query") or "").strip()
        if not query:
            return jsonify({"error": "empty query"}), 400

        rewind = debug_query_enabled(request.args.get("debug"))
        result = run_search(query, body.get("chat_id"), rewind=rewind)
        if result.get("error"):
            err = str(result["error"])
            status = 502 if "network error" in err else 400
            return jsonify(result), status
        return jsonify(result)

    @app.get("/api/tool-order")
    def api_tool_order():
        return jsonify(build_tool_order(CHATS))

    _app = app
    return app
