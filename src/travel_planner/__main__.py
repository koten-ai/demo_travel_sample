"""CLI entry point: python -m travel_planner"""
import os

from travel_planner.app import create_app


def main() -> None:
    app = create_app()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("ENVIRONMENT") == "dev")


if __name__ == "__main__":
    main()