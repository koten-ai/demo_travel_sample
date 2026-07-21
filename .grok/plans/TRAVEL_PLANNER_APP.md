# Plan: Travel Planner App (Flask + DaisyUI + Zeus + Docker)

**Date**: 2026-07-01
**Task**: Create a Dockerized travel planner with full-text search, destination result cards, and a floating Zeus trace debug panel.
**Priority**: High
**Estimated Effort**: 5–7 hours / 9 steps

## 1. Context & Requirements

- **Goal**: User enters travel preferences, submits, sees destination cards (name, description, image), and toggles a floating debug trace panel.
- **Constraints**: Flask API; Zeus via sibling `../zeus_client` (`PYTHONPATH`); DaisyUI + plain HTML/JS; Docker primary deployment.
- **Assumptions**: `travel-sample/_default` scope on Zeus; `travel_booking` mode catalog available.
- **Out of Scope**: Setup wizard, settings UI, chat history overlay, contract publishing.

## 2. Analysis & Research

- Agent loop: `python3.agent.loop.run_agent` (zeus_client `/api/chat` pattern)
- Trace: `trace.tool_calls[].result_json` for destination rows
- Trace UI: ported from `zeus_client/templates/index.html` + `static/app.css`
- Docker: BuildKit `additional_contexts` to bundle zeus_client from sibling repo

## 3. Step-by-Step Implementation Plan

1. Project scaffold (`app.py`, `services/`, `templates/`, `static/`)
2. Docker (`Dockerfile`, `docker-compose.yml`, `.dockerignore`)
3. Async bridge (`services/async_runner.py`)
4. Search API (`POST /api/search`, `GET /api/tool-order`)
5. Results parser (`services/results_parser.py`)
6. Frontend (DaisyUI search + card grid)
7. Floating trace panel (`static/trace.js`)
8. Config adapter (`services/config.py`)
9. Verification + guide

## 4. Verification & Rollback

- `docker compose up --build` → search flow + trace panel
- Guide: `.grok/guides/TRAVEL_PLANNER.md`
- Rollback: `docker compose down`; delete new files

## 5. Open Questions / Decisions

- Zeus dependency: sibling via `PYTHONPATH=/zeus`
- Docker build: BuildKit `additional_contexts: zeus: ../zeus_client`
- Port: 5000