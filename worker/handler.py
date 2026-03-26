import runpod
import os
import uuid
import requests
import json
import subprocess

def download_file(url, local_path):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(local_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

def handler(job):
    """ Serverless handler for RunPod """
    job_input = job['input']
    audio_url = job_input.get('audio_url')
    
    if not audio_url:
        return {"error": "audio_url is required"}

    # Ephemeral secure processing setup
    temp_id = str(uuid.uuid4())
    local_audio_path = f"/tmp/{temp_id}_audio.tmp"
    output_json_path = f"/tmp/{temp_id}_transcript.json"

    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        # We can still run whisper without diarization, but pyannote requires it.
        pass

    try:
        # 1. Download audio
        download_file(audio_url, local_audio_path)

        # 2. Run insanely-fast-whisper
        command = [
            "insanely-fast-whisper",
            "--file-name", local_audio_path,
            "--model-name", "openai/whisper-large-v3",
            "--device-id", "0",
            "--batch-size", "24",
            "--transcript-path", output_json_path
        ]
        
        if hf_token:
            command.extend(["--hf-token", hf_token])
            
        subprocess.run(command, check=True, capture_output=True, text=True)

        # 3. Read output
        with open(output_json_path, 'r', encoding='utf-8') as f:
            transcript_data = json.load(f)

        return {"status": "success", "transcript": transcript_data}

    except subprocess.CalledProcessError as e:
        return {"error": "Transcription failed", "details": e.stderr}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # CRITICAL: Clean up temporary files directly
        if os.path.exists(local_audio_path):
            os.remove(local_audio_path)
        if os.path.exists(output_json_path):
            os.remove(output_json_path)

runpod.serverless.start({"handler": handler})
