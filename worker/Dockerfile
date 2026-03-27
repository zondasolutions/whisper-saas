# Use the RunPod PyTorch base image (matches the pod image used for model caching)
# This ensures CUDA version parity with the Network Volume environment
FROM runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Point HuggingFace to Network Volume cache (also set in handler.py at runtime)
ENV HF_HOME=/runpod-volume/hf_cache
ENV TRANSFORMERS_CACHE=/runpod-volume/hf_cache

WORKDIR /app
COPY requirements.txt /app/

# Install Python dependencies
# flash-attn requires --no-build-isolation and takes a while to compile
RUN pip install --no-cache-dir -r requirements.txt --no-build-isolation

COPY handler.py /app/handler.py

CMD ["python", "-u", "/app/handler.py"]
