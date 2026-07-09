FROM python:3.12-slim

WORKDIR /app

# Monorepo build: docker-compose context is parent (koten-ai/)
COPY demo_travel_sample/pyproject.toml demo_travel_sample/requirements.txt ./
COPY zeus_client_python /tmp/zeus_client_python
COPY demo_travel_sample/src ./src
COPY demo_travel_sample/data ./data
COPY demo_travel_sample/config.example.json .

RUN pip install --no-cache-dir /tmp/zeus_client_python \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir --no-deps -e .

ENV PORT=5000
ENV ZEUS_CLIENT_CONFIG_DIR=/app
ENV ZEUS_CHAT_REQUESTS_DIR=/app/data/chat_requests

EXPOSE 5000
CMD ["python", "-m", "travel_planner"]