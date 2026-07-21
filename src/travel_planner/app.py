"""Flask application factory."""
import json
import os

from flask import Flask, jsonify, render_template, request
from zeus_client import build_tool_order

from travel_planner.async_runner import startup
from travel_planner.chat_store import CHATS
from travel_planner.paths import PACKAGE_DIR, PROJECT_ROOT
from travel_planner.search import run_search
from travel_planner.zeus_config import configure_zeus_client

_app: Flask | None = None


def _load_build_version() -> str:
    """Read build_version from project config.json (empty string if missing)."""
    config_path = PROJECT_ROOT / "config.json"
    try:
        with open(config_path, encoding="utf-8") as f:
            data = json.load(f)
        return str(data.get("build_version") or "").strip()
    except (OSError, json.JSONDecodeError, TypeError):
        return ""


def create_app() -> Flask:
    """Create and configure the Flask application."""
    global _app
    if _app is not None:
        return _app

    configure_zeus_client()
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
        )

    @app.post("/api/search")
    def api_search():
        body = request.get_json(silent=True) or {}
        query = (body.get("query") or "").strip()
        if not query:
            return jsonify({"error": "empty query"}), 400

        result = run_search(query, body.get("chat_id"))
        if result.get("error"):
            status = 502 if "network error" in result["error"] else 400
            return jsonify(result), status
        return jsonify(result)

    @app.get("/api/tool-order")
    def api_tool_order():
        return jsonify(build_tool_order(CHATS))

    _app = app
    return app