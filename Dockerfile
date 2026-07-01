FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml requirements.txt ./
COPY vendor ./vendor
COPY src ./src
COPY config.example.json .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir --no-deps -e .

ENV ZEUS_URL=http://host.docker.internal:8080
ENV PORT=5000

EXPOSE 5000
CMD ["python", "-m", "travel_planner"]