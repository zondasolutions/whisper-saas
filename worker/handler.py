import runpod
import os
import uuid
import requests
import json
import torch
import gc
import boto3
from botocore.config import Config as BotoConfig
import whisperx
from df.enhance import enhance, init_df, load_audio, save_audio

# CRITICAL: Point HuggingFace to the Network Volume cache BEFORE any model imports.
os.environ["HF_HOME"] = "/runpod-volume/hf_cache"
os.environ["TRANSFORMERS_CACHE"] = "/runpod-volume/hf_cache"

# Global Model Caches for zero-latency warm starts
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
COMPUTE_TYPE = "float16" if torch.cuda.is_available() else "int8"
BATCH_SIZE = 16

WHISPER_MODEL = None
DIARIZE_MODEL = None
DF_MODEL = None
DF_STATE = None
ALIGN_MODELS = {}

def get_df_model():
    global DF_MODEL, DF_STATE
    if DF_MODEL is None:
        DF_MODEL, DF_STATE, _ = init_df()
    return DF_MODEL, DF_STATE

def get_whisper_model():
    global WHISPER_MODEL
    if WHISPER_MODEL is None:
        WHISPER_MODEL = whisperx.load_model("large-v3", DEVICE, compute_type=COMPUTE_TYPE)
    return WHISPER_MODEL

def get_diarize_model(hf_token):
    global DIARIZE_MODEL
    if DIARIZE_MODEL is None and hf_token:
        DIARIZE_MODEL = whisperx.DiarizationPipeline(use_auth_token=hf_token, device=DEVICE)
    return DIARIZE_MODEL

def get_align_model(language_code):
    global ALIGN_MODELS
    if language_code not in ALIGN_MODELS:
        model_a, metadata = whisperx.load_align_model(language_code=language_code, device=DEVICE)
        ALIGN_MODELS[language_code] = (model_a, metadata)
    return ALIGN_MODELS[language_code]

def purge_resources():
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

def enhance_chunked(df_model, df_state, audio_tensor, chunk_duration_s=300):
    """Process audio through DeepFilterNet in chunks to avoid GPU OOM on long audio.
    
    DeepFilterNet processes the full spectral tensor in one shot, which causes
    OOM on audio longer than ~15 minutes (the conv2d layer tries to allocate
    12+ GiB for the intermediate tensor). This function splits the audio into
    manageable segments and processes each one independently.
    
    Args:
        chunk_duration_s: Duration of each chunk in seconds (default: 300 = 5 min)
    """
    sr = df_state.sr()
    chunk_samples = chunk_duration_s * sr
    total_samples = audio_tensor.shape[-1]
    
    # Short audio: process directly (no chunking overhead)
    if total_samples <= chunk_samples:
        return enhance(df_model, df_state, audio_tensor)
    
    total_duration = total_samples / sr
    num_chunks = (total_samples + chunk_samples - 1) // chunk_samples
    print(f"Audio is {total_duration:.0f}s — chunking into {num_chunks} segments of {chunk_duration_s}s for noise cleanup...")
    
    enhanced_chunks = []
    
    for i in range(num_chunks):
        start = i * chunk_samples
        end = min((i + 1) * chunk_samples, total_samples)
        chunk = audio_tensor[..., start:end]
        
        print(f"  Cleaning chunk {i+1}/{num_chunks} ({start/sr:.0f}s – {end/sr:.0f}s)...")
        enhanced_chunk = enhance(df_model, df_state, chunk)
        enhanced_chunks.append(enhanced_chunk.cpu())
        
        # Free GPU memory between chunks
        del chunk, enhanced_chunk
        purge_resources()
    
    # Concatenate all enhanced chunks and return
    return torch.cat(enhanced_chunks, dim=-1)

def download_file(url: str, local_path: str):
    response = requests.get(url, stream=True, timeout=300)
    response.raise_for_status()
    with open(local_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=65536):
            f.write(chunk)

def upload_clean_audio_to_r2(clean_audio_path: str, temp_id: str, sample_rate: int):
    """Upload clean audio to R2 for admin preview.
    
    - Audio ≤ 10 min: uploads the full clean WAV
    - Audio > 10 min: uploads only the first 2 minutes as a sample
    
    Returns the R2 object key if successful, None otherwise.
    """
    import soundfile as sf
    
    r2_account_id = os.environ.get("R2_ACCOUNT_ID")
    r2_access_key = os.environ.get("R2_ACCESS_KEY_ID")
    r2_secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    r2_bucket = os.environ.get("R2_BUCKET_NAME", "whisper-saas-audio")
    
    if not all([r2_account_id, r2_access_key, r2_secret_key]):
        print("R2 credentials not configured — skipping clean audio upload.")
        return None
    
    # Read the clean audio to check duration
    audio_data, sr = sf.read(clean_audio_path)
    total_duration_s = len(audio_data) / sr
    
    SAMPLE_THRESHOLD_S = 600  # 10 minutes
    SAMPLE_DURATION_S = 120   # 2 minutes preview
    
    upload_path = clean_audio_path
    sample_path = None
    is_sample = False
    
    if total_duration_s > SAMPLE_THRESHOLD_S:
        # Only upload first 2 minutes as a preview sample
        sample_frames = int(SAMPLE_DURATION_S * sr)
        sample_data = audio_data[:sample_frames]
        sample_path = f"/tmp/{temp_id}_clean_sample.wav"
        sf.write(sample_path, sample_data, sr)
        upload_path = sample_path
        is_sample = True
        print(f"Audio is {total_duration_s:.0f}s (>{SAMPLE_THRESHOLD_S}s) — uploading {SAMPLE_DURATION_S}s sample.")
    else:
        print(f"Audio is {total_duration_s:.0f}s (≤{SAMPLE_THRESHOLD_S}s) — uploading full clean audio.")
    
    del audio_data  # Free memory
    
    # Upload to R2
    s3_client = boto3.client(
        's3',
        endpoint_url=f"https://{r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=r2_access_key,
        aws_secret_access_key=r2_secret_key,
        config=BotoConfig(signature_version='s3v4')
    )
    
    suffix = "_sample" if is_sample else ""
    object_key = f"clean-audio/{temp_id}{suffix}.wav"
    
    s3_client.upload_file(
        upload_path,
        r2_bucket,
        object_key,
        ExtraArgs={"ContentType": "audio/wav"}
    )
    
    # Clean up sample file if created
    if sample_path and os.path.exists(sample_path):
        os.remove(sample_path)
    
    print(f"Clean audio uploaded to R2: {object_key}")
    return object_key

def handler(job):
    job_input = job['input']
    audio_url = job_input.get('audio_url')
    initial_prompt = job_input.get('initial_prompt')  # Contextual prompt for Whisper decoder
    return_clean_audio = job_input.get('return_clean_audio', False)  # Admin-only feature

    if not audio_url:
        return {"error": "audio_url is required in job input"}

    temp_id = str(uuid.uuid4())
    from urllib.parse import urlparse
    url_path = urlparse(audio_url).path
    file_ext = os.path.splitext(url_path)[1] or ".mp3"
    
    local_audio_path = f"/tmp/{temp_id}_audio{file_ext}"
    clean_audio_path = f"/tmp/{temp_id}_clean.wav"
    hf_token = os.environ.get("HF_TOKEN")

    try:
        # Step 1: Download audio
        download_file(audio_url, local_audio_path)

        # Step 2: DeepFilterNet Enhancement (chunked for long audio)
        df_model, df_state = get_df_model()
        df_audio, _ = load_audio(local_audio_path, sr=df_state.sr())
        enhanced = enhance_chunked(df_model, df_state, df_audio)
        save_audio(clean_audio_path, enhanced, df_state.sr())
        del df_audio, enhanced

        # VRAM Optimization: Move DeepFilterNet to CPU after use to free ~1.5GB VRAM
        # for WhisperX and Diarization which need much more memory on long audio.
        df_model.to("cpu")
        purge_resources()

        # Step 2b: Upload clean audio sample to R2 (admin-only feature)
        clean_audio_key = None
        if return_clean_audio:
            try:
                clean_audio_key = upload_clean_audio_to_r2(clean_audio_path, temp_id, df_state.sr())
            except Exception as e:
                print(f"Warning: Failed to upload clean audio to R2: {e}")
                clean_audio_key = None

        # Step 3: Transcribe with WhisperX
        whisper_model = get_whisper_model()
        audio = whisperx.load_audio(clean_audio_path)

        # WhisperX stores initial_prompt in model.options (a NamedTuple), not as
        # a transcribe() kwarg. We swap it per-request and restore afterwards to
        # avoid leaking context between jobs on the same warm worker.
        original_options = whisper_model.options
        if initial_prompt:
            # SANITIZATION: Whisper hallucinations happen when the prompt looks like a 
            # grammatically complete sentence (e.g., ends in a period). Since WhisperX 
            # passes this prompt to *every* 30s VAD chunk, we must break the syntax so 
            # the decoder treats it purely as a bag of vocabulary keywords.
            safe_prompt = str(initial_prompt).replace('.', ',').replace(':', ' ').replace('\n', ' ')
            whisper_model.options = whisper_model.options._replace(initial_prompt=safe_prompt)

        result = whisper_model.transcribe(audio, batch_size=BATCH_SIZE)

        # Restore original options for next request
        whisper_model.options = original_options

        # VRAM Optimization: Free transcription KV-cache before alignment
        purge_resources()
        
        # Step 4: Align
        language = result.get("language", "en")
        model_a, metadata = get_align_model(language)
        result = whisperx.align(result["segments"], model_a, metadata, audio, DEVICE, return_char_alignments=False)

        # VRAM Optimization: Move Align models to CPU before Diarization
        # Note: WhisperX uses CTranslate2 internally (no .to() method), so we skip it.
        for m_a, _ in ALIGN_MODELS.values():
            m_a.to("cpu")
            
        purge_resources()
        
        # Step 5: Diarization based on Optional Arguments
        if hf_token:
            diarize_model = get_diarize_model(hf_token)
            
            diarize_kwargs = {}
            if job_input.get('num_speakers'):
                diarize_kwargs['num_speakers'] = int(job_input['num_speakers'])
            elif job_input.get('min_speakers'):
                diarize_kwargs['min_speakers'] = int(job_input['min_speakers'])
                if job_input.get('max_speakers'):
                    diarize_kwargs['max_speakers'] = int(job_input['max_speakers'])
            
            diarize_segments = diarize_model(audio, **diarize_kwargs)
            result = whisperx.assign_word_speakers(diarize_segments, result)
        
        # Final Format Cleanup
        segments = []
        for segment in result.get("segments", []):
            segments.append({
                "speaker": segment.get("speaker", "Speaker 1"),
                "start": segment.get("start", 0),
                "text": segment.get("text", "").strip(),
            })

        response = {
            "status": "success",
            "transcript": {"segments": segments},
        }
        if clean_audio_key:
            response["clean_audio_key"] = clean_audio_key

        return response

    except Exception as e:
        import traceback
        print(f"--- WORKER ERROR ---\n{traceback.format_exc()}")
        return {"error": str(e)}
    finally:
        # Step 6: Critical Garbage Collection
        for path in [local_audio_path, clean_audio_path]:
            if os.path.exists(path):
                os.remove(path)
        
        purge_resources()

runpod.serverless.start({"handler": handler})
