const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

let authToken = null;

export const apiClient = {
  setToken(token) {
    authToken = token;
  },

  getHeaders(customHeaders = {}) {
    const headers = { ...customHeaders };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  },

  /**
   * 3-step secure upload:
   * 1. Get a presigned PUT URL from the backend
   * 2. Upload the file directly to Cloudflare R2 (zero backend bandwidth)
   * 3. Return { file_key } for use in the transcribe call
   */
  async upload(file) {
    // Step 1: Request presigned URL
    const urlRes = await fetch(`${API_BASE_URL}/upload-url`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type || 'audio/mpeg',
      }),
    });

    if (!urlRes.ok) {
      const err = await urlRes.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to get upload URL');
    }

    const { upload_url, file_key } = await urlRes.json();

    // Step 2: PUT file directly to R2 via presigned URL
    const uploadRes = await fetch(upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'audio/mpeg' },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload to storage failed (HTTP ${uploadRes.status})`);
    }

    return { file_key };
  },

  /**
   * Submits a transcription job to the backend, which dispatches it to RunPod.
   * Returns { job_id } for polling.
   */
  async transcribe(fileKey, durationSeconds = 0, options = {}) {
    const { numSpeakers, minSpeakers, maxSpeakers } = options;
    const bodyArgs = { file_key: fileKey, duration_seconds: Math.ceil(durationSeconds) };
    
    if (numSpeakers) bodyArgs.num_speakers = parseInt(numSpeakers, 10);
    if (minSpeakers) bodyArgs.min_speakers = parseInt(minSpeakers, 10);
    if (maxSpeakers) bodyArgs.max_speakers = parseInt(maxSpeakers, 10);

    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(bodyArgs),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to start transcription');
    }

    return response.json(); // { status, job_id, message }
  },

  /**
   * Polls RunPod job status via the backend.
   * Returns { status: 'processing' | 'completed' | 'failed' | 'local_mode', transcript? }
   */
  async getStatus(jobId) {
    const response = await fetch(`${API_BASE_URL}/status/${jobId}`, {
        headers: this.getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Status check failed (HTTP ${response.status})`);
    }
    return response.json();
  },

  async getUsage() {
    const response = await fetch(`${API_BASE_URL}/usage/me`, {
        headers: this.getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch usage');
    }
    return response.json();
  },

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, is_admin: false }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  }
};
