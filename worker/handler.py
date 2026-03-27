import runpod
import os
import uuid
import requests
import json
import subprocess

# CRITICAL: Point HuggingFace to the Network Volume cache BEFORE any model imports.
# This ensures insanely-fast-whisper and pyannote use pre-downloaded weights
# instead of downloading them fresh on every cold start.
os.environ["HF_HOME"] = "/runpod-volume/hf_cache"
os.environ["TRANSFORMERS_CACHE"] = "/runpod-volume/hf_cache"


def download_file(url: str, local_path: str):
    """Download a file from a presigned URL to a local path."""
    response = requests.get(url, stream=True, timeout=300)
    response.raise_for_status()
    with open(local_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=65536):
            f.write(chunk)


def handler(job):
    """RunPod Serverless handler for audio transcription with speaker diarization."""
    job_input = job['input']
    audio_url = job_input.get('audio_url')

    if not audio_url:
        return {"error": "audio_url is required in job input"}

    # Ephemeral secure processing — unique temp paths per job
    temp_id = str(uuid.uuid4())
    local_audio_path = f"/tmp/{temp_id}_audio.tmp"
    output_json_path = f"/tmp/{temp_id}_transcript.json"

    hf_token = os.environ.get("HF_TOKEN")

    try:
        # Step 1: Download audio from R2 presigned URL
        download_file(audio_url, local_audio_path)

        # Step 2: Run insanely-fast-whisper with speaker diarization
        command = [
            "insanely-fast-whisper",
            "--file-name", local_audio_path,
            "--model-name", "openai/whisper-large-v3",
            "--device-id", "0",
            "--batch-size", "24",
            "--transcript-path", output_json_path,
        ]

        # Diarization requires HF token + pyannote license accepted
        if hf_token:
            command.extend([
                "--hf-token", hf_token,
                "--diarization_model", "pyannote/speaker-diarization-3.1",
            ])

        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=600  # 10 min max per job
        )

        # Step 3: Read and return transcript
        with open(output_json_path, 'r', encoding='utf-8') as f:
            transcript_data = json.load(f)

        # Normalize output to match frontend expectations:
        # { segments: [{speaker, start, text}] }
        segments = []
        for chunk in transcript_data.get("speakers", transcript_data.get("chunks", [])):
            segments.append({
                "speaker": chunk.get("speaker", "Speaker 1"),
                "start": chunk.get("timestamp", [0])[0],
                "text": chunk.get("text", "").strip(),
            })

        return {
            "status": "success",
            "transcript": {"segments": segments},
        }

    except subprocess.CalledProcessError as e:
        return {"error": "Transcription failed", "details": e.stderr[-2000:]}
    except subprocess.TimeoutExpired:
        return {"error": "Transcription timed out (>10 min)"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # CRITICAL: Purge audio and transcript immediately after processing
        for path in [local_audio_path, output_json_path]:
            if os.path.exists(path):
                os.remove(path)


runpod.serverless.start({"handler": handler})
