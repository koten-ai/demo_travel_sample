"""Flask application factory."""
import os

from flask import Flask, jsonify, render_template, request
from zeus_client import build_tool_order

from travel_planner.async_runner import startup
from travel_planner.chat_store import CHATS
from travel_planner.paths import PACKAGE_DIR
from travel_planner.search import run_search
from travel_planner.zeus_config import configure_zeus_client

_app: Flask | None = None


def create_app() -> Flask:
    """Create and configure the Flask application."""
    global _app
    if _app is not None:
        return _app

    configure_zeus_client()
    startup()

    app = Flask(
        __name__,
        template_folder=str(PACKAGE_DIR / "templates"),
        static_folder=str(PACKAGE_DIR / "static"),
    )

    @app.get("/")
    def index():
        return render_template("index.html", tool_order=build_tool_order(CHATS))

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