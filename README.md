# Whisper SaaS MVP

This is an advanced, high-velocity audio transcription MVP leveraging `insanely-fast-whisper` deployed to RunPod Serverless with a FastAPI orchestration backend.

## Tech Stack
- **Backend Context:** FastAPI (`python 3.11`)
- **Storage/Presigned URLs:** Cloudflare R2 (S3-compatible via `boto3`)
- **Worker Configuration:** PyTorch, RunPod SDK, `pyannote.audio`
- **Orchestration:** Docker Compose

## Security
Data is uploaded via strict presigned PUT URL and directly dispatched to the container. Audio files are stored temporarily on container ephemeral storage and purged upon transcription execution. Zero model-retraining is implicitly guaranteed.

## How to Run Locally

```bash
docker compose up --build
```

Then visit `http://localhost:8000/docs` to test the API endpoints-
