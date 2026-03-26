import React, { useState, useRef } from 'react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, done, error
  const [transcript, setTranscript] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const simulateProcessing = () => {
    setStatus('uploading');
    
    // Simulate API calls
    setTimeout(() => {
      setStatus('processing');
      
      setTimeout(() => {
        setStatus('done');
        setTranscript([
          { speaker: "Speaker 1", start: "00:00", text: "Welcome to the real-time transcription test." },
          { speaker: "Speaker 2", start: "00:03", text: "This looks absolutely incredible!" },
          { speaker: "Speaker 1", start: "00:06", text: "Yes, the UI is premium and processing is ridiculously fast." }
        ]);
      }, 3500);
    }, 1500);
  };

  const resetState = () => {
    setFile(null);
    setStatus('idle');
    setTranscript(null);
  };

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <div className="container">
        <h1>UltraFast AI Audio</h1>
        <p className="subtitle">Enterprise-grade transcription. 100% ephemeral processing. Impossible speed.</p>
        
        <div className="glass-card">
          
          {status === 'idle' && (
            <div 
              className={`dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileClick}
            >
              <div className="drop-icon">✧</div>
              {file ? (
                <div style={{color: 'var(--secondary-color)', fontWeight: '500'}}>
                  Selected: {file.name}
                </div>
              ) : (
                <>
                  <div style={{fontWeight: '600', fontSize: '1.2rem'}}>
                    Drag & Drop your audio here
                  </div>
                  <div style={{color: 'var(--text-muted)'}}>
                    MP3, M4A, WAV up to 500MB
                  </div>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{display: 'none'}} 
                accept="audio/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {status === 'uploading' && (
            <div className="processing-state">
              <div className="loader"></div>
              <h3>Encrypting & Uploading to Secure Storage...</h3>
              <p style={{color: 'var(--text-muted)'}}>Establishing zero-trust connection</p>
            </div>
          )}

          {status === 'processing' && (
            <div className="processing-state">
              <div className="loader" style={{borderLeftColor: 'var(--secondary-color)'}}></div>
              <h3>AI is Transcribing on GPU...</h3>
              <p style={{color: 'var(--text-muted)'}}>Large-v3 Model + Speaker Diarization active</p>
            </div>
          )}

          {status === 'done' && (
            <div className="result-area">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Transcription Ready</h3>
                <span style={{color: 'var(--secondary-color)', fontSize: '0.9rem'}}>Ephemeral data purged</span>
              </div>
              
              <div className="transcript-box">
                {transcript.map((item, idx) => (
                  <div className="segment" key={idx}>
                    <span className="timestamp">[{item.start}]</span>
                    <span className="speaker-tag">{item.speaker}:</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
                <button 
                  className="btn-primary" 
                  style={{background: 'transparent', border: '1px solid var(--text-muted)', padding: '0.5rem 1.5rem'}}
                  onClick={resetState}
                >
                  Transcribe Another
                </button>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div style={{textAlign: 'center'}}>
              <button 
                className="btn-primary" 
                onClick={simulateProcessing}
                disabled={!file}
              >
                Transcribe Now
              </button>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px'}}>
                Free tier: Max 5 minutes. No credit card required.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default App;
