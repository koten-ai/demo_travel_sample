"""CLI entry point: python -m travel_planner"""
import os

from travel_planner.app import create_app


def main() -> None:
    app = create_app()
    host = (os.environ.get("HOST") or "0.0.0.0").strip() or "0.0.0.0"
    port = int(os.environ.get("PORT", "5000"))
    app.run(host=host, port=port, debug=os.environ.get("ENVIRONMENT") == "dev")


if __name__ == "__main__":
    main()