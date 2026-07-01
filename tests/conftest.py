"""Shared pytest fixtures."""
import pytest


@pytest.fixture
def flask_client(monkeypatch):
    """Flask test client with startup side effects disabled."""
    monkeypatch.setattr("travel_planner.app.startup", lambda: None)

    import travel_planner.app as app_module

    app_module._app = None
    from travel_planner.app import create_app

    app = create_app()
    with app.test_client() as client:
        yield client

    app_module._app = None