# Use the RunPod PyTorch base image (matches the pod image used for model caching)
# This ensures CUDA version parity with the Network Volume environment
FROM runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    libavdevice-dev \
    libavfilter-dev \
    libswresample-dev \
    libswscale-dev \
    libavutil-dev \
    pkg-config \
    git \
    wget \
    build-essential \
    libsox-fmt-all \
    && rm -rf /var/lib/apt/lists/*

# Point HuggingFace to Network Volume cache (also set in handler.py at runtime)
ENV HF_HOME=/runpod-volume/hf_cache
ENV TRANSFORMERS_CACHE=/runpod-volume/hf_cache
# Reduce VRAM fragmentation for long audio files on 24GB GPUs
ENV PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True

WORKDIR /app

# Pre-install build tools
RUN pip install --no-cache-dir Cython

# Phase 1: Install flash-attn FIRST while cuDNN 9 is intact (it imports torch during build)
RUN pip install --no-cache-dir flash-attn --no-build-isolation

# Phase 2: Install cuDNN 8 compatibility layer required by CTranslate2 (faster-whisper).
# The base image ships cuDNN 9 (.so.9) but CTranslate2 links against .so.8
# We copy the .so.8 files directly into the system lib path so the dynamic linker
# always finds them, even if RunPod overrides LD_LIBRARY_PATH at runtime.
RUN pip install --no-cache-dir nvidia-cudnn-cu12==8.9.7.29 && \
    cp -P /usr/local/lib/python3.11/dist-packages/nvidia/cudnn/lib/libcudnn*.so.8* /usr/lib/x86_64-linux-gnu/ && \
    ldconfig

COPY requirements.txt /app/

# Phase 3: Install remaining Python dependencies (whisperx, deepfilternet, etc.)
RUN pip install --default-timeout=1000 --retries 10 --no-cache-dir -r requirements.txt

COPY handler.py /app/handler.py

CMD ["python", "-u", "/app/handler.py"]
