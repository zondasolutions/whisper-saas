import { useRef, useState } from 'react';

export default function UploadArea({ file, setFile, onTranscribe }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) setFile(f);
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
    };

    return (
        <div className="max-w-2xl mx-auto pt-8">
            <h1 className="text-3xl font-bold font-headline text-white mb-2">New Transcription</h1>
            <p className="text-on-surface-variant mb-10">Upload an audio file to get started.</p>

            {/* Big upload button */}
            <button
                onClick={() => fileInputRef.current.click()}
                className="w-full btn-primary justify-center mb-6 text-xl py-5"
            >
                <span className="material-symbols-outlined text-2xl">upload_file</span>
                Upload Audio
            </button>

            {/* Drag & drop area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                        ? 'border-primary-container bg-primary-container/10'
                        : file
                            ? 'border-secondary/50 bg-secondary/5'
                            : 'border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/30'
                    }`}
            >
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">
                    {file ? 'audio_file' : 'cloud_upload'}
                </span>
                {file ? (
                    <div>
                        <p className="text-secondary font-semibold text-lg">{file.name}</p>
                        <p className="text-on-surface-variant text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <>
                        <p className="text-on-surface font-semibold text-lg mb-1">or drag & drop your file here</p>
                        <p className="text-on-surface-variant text-sm">MP3, WAV, M4A, OGG up to 500MB</p>
                    </>
                )}
                <div className="flex justify-center gap-2 mt-4">
                    {['MP3', 'WAV', 'M4A', 'OGG'].map((fmt) => (
                        <span key={fmt} className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-mono border border-outline-variant/20">
                            {fmt}
                        </span>
                    ))}
                </div>
            </div>

            <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />

            <div className="text-center mt-8">
                <button
                    onClick={onTranscribe}
                    disabled={!file}
                    className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${file
                            ? 'bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container hover:opacity-90'
                            : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                        }`}
                    style={file ? { boxShadow: '0 0 20px rgba(108,92,231,0.3)' } : {}}
                >
                    Transcribe Now
                </button>
                <p className="text-xs text-on-surface-variant mt-3">Free tier: max 5 minutes · No credit card required</p>
            </div>
        </div>
    );
}
