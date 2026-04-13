import runpod
import os
import uuid
import requests
import json
import torch
import gc
import whisperx
from df.enhance import enhance, init_df, load_audio, save_audio

# CRITICAL: Point HuggingFace to the Network Volume cache BEFORE any model imports.
os.environ["HF_HOME"] = "/runpod-volume/hf_cache"
os.environ["TRANSFORMERS_CACHE"] = "/runpod-volume/hf_cache"

# Global Model Caches for zero-latency warm starts
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
COMPUTE_TYPE = "float16" if torch.cuda.is_available() else "int8"
BATCH_SIZE = 8

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

def handler(job):
    job_input = job['input']
    audio_url = job_input.get('audio_url')

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

        # Step 3: Transcribe with WhisperX
        whisper_model = get_whisper_model()
        audio = whisperx.load_audio(clean_audio_path)
        result = whisper_model.transcribe(audio, batch_size=BATCH_SIZE)

        # VRAM Optimization: Free transcription KV-cache before alignment
        purge_resources()
        
        # Step 4: Align
        language = result.get("language", "en")
        model_a, metadata = get_align_model(language)
        result = whisperx.align(result["segments"], model_a, metadata, audio, DEVICE, return_char_alignments=False)

        # VRAM Optimization: Move Whisper and Align models to CPU before Diarization
        # This frees up ~7-8GB of VRAM for the heaviest stage.
        if WHISPER_MODEL:
            WHISPER_MODEL.model.to("cpu")
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

            # Move Whisper back to GPU for next jobs (optional, but good for latency)
            if WHISPER_MODEL:
                WHISPER_MODEL.model.to(DEVICE)
        
        # Final Format Cleanup
        segments = []
        for segment in result.get("segments", []):
            segments.append({
                "speaker": segment.get("speaker", "Speaker 1"),
                "start": segment.get("start", 0),
                "text": segment.get("text", "").strip(),
            })

        return {
            "status": "success",
            "transcript": {"segments": segments},
        }

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
