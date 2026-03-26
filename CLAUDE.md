# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend
```bash
cd frontend
npm run dev       # Dev server with HMR (http://localhost:5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Backend
```bash
docker compose up --build   # Run full stack (backend on http://localhost:8000)
# FastAPI docs available at http://localhost:8000/docs
```

### Worker (RunPod)
The worker is deployed to RunPod serverless — not run locally. Build/push the Docker image:
```bash
cd worker
docker build -t <your-registry>/whisper-worker .
docker push <your-registry>/whisper-worker
```

## Architecture

Three-tier serverless transcription pipeline:

```
React Frontend → FastAPI Backend → RunPod GPU Worker
     ↕                ↕                  ↕
  (Vite)        (Orchestration)    (Whisper Large-v3)
                      ↕
               Cloudflare R2 (S3-compatible storage)
```

### Data Flow
1. Frontend requests a presigned PUT URL from `POST /api/v1/upload-url`
2. Frontend uploads audio **directly to Cloudflare R2** using the presigned URL (bypasses backend)
3. Frontend calls `POST /api/v1/transcribe` with the `file_key`
4. Backend generates a presigned GET URL and submits an async job to RunPod
5. RunPod worker downloads audio from R2 to `/tmp`, runs Whisper + pyannote diarization, cleans up
6. Transcript result returned (polling not yet implemented — frontend currently uses mock data)

### Key Design Decisions
- **Presigned URLs**: Audio never passes through the backend — reduces load and cost
- **Ephemeral processing**: Worker deletes files from `/tmp` after transcription; R2 stores originals
- **Auth is a placeholder**: `get_current_user()` returns a dummy `user_id` — JWT not implemented yet
- **Frontend mocks**: `App.jsx` uses `setTimeout` + fake data; real polling to RunPod not wired up

### Backend (`backend/`)
- `app/main.py` — FastAPI app, mounts two routers
- `app/core/config.py` — Pydantic `BaseSettings` for R2 and RunPod credentials; has fallback dummy values for local dev without `.env`
- `app/api/endpoints/upload.py` — `POST /api/v1/upload-url` generates presigned upload URL (15 min expiry)
- `app/api/endpoints/transcribe.py` — `POST /api/v1/transcribe` generates presigned download URL, submits RunPod job
- `app/services/s3_service.py` — boto3 client pointed at Cloudflare R2 endpoint
- `app/services/runpod_service.py` — RunPod SDK job submission

### Worker (`worker/`)
- `handler.py` — RunPod serverless handler: downloads audio, runs `insanely-fast-whisper` (batch_size=24, `openai/whisper-large-v3`, GPU 0), optionally runs pyannote speaker diarization, returns transcript
- Base image: `pytorch:2.2.0-cuda12.1-cudnn8-runtime` with ffmpeg

### Frontend (`frontend/`)
- Single-page app: `src/App.jsx` manages the full state machine (`idle → uploading → processing → done`)
- Glassmorphism design in `src/index.css`
- `src/App.css` is legacy and unused

## Environment Variables

Backend reads from `.env` (via `app/core/config.py`):
```
R2_ENDPOINT_URL
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
RUNPOD_API_KEY
RUNPOD_ENDPOINT_ID
```
