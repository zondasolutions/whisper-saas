import { useState, useRef } from 'react'

const NAV_ITEMS = [
  { icon: 'add_circle', label: 'New Transcription', id: 'new' },
  { icon: 'history',    label: 'History',           id: 'history' },
  { icon: 'settings',   label: 'Settings',          id: 'settings' },
]

const MOCK_TRANSCRIPT = [
  { speaker: 'Speaker 1', start: '00:00', text: 'Welcome to the real-time transcription test. This is a demonstration of Voxify.' },
  { speaker: 'Speaker 2', start: '00:05', text: 'The accuracy is incredible. I can barely tell it from a human transcriber.' },
  { speaker: 'Speaker 1', start: '00:11', text: 'Exactly. And the speaker diarization just works out of the box with no configuration needed.' },
  { speaker: 'Speaker 2', start: '00:18', text: 'How long did the processing take for this four-minute audio file?' },
  { speaker: 'Speaker 1', start: '00:22', text: 'Under 30 seconds. The Whisper Large-v3 model on GPU is ridiculously fast.' },
]

export default function AppView({ onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [status, setStatus] = useState('idle') // idle | uploading | processing | done
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeSegment, setActiveSegment] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleTranscribe = () => {
    setStatus('uploading')
    setTimeout(() => {
      setStatus('processing')
      setTimeout(() => {
        setStatus('done')
        setActiveSegment(0)
      }, 3500)
    }, 1500)
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setActiveSegment(null)
  }

  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="sonic-orb bg-primary-container w-[400px] h-[400px] -top-32 -left-16" />
        <div className="sonic-orb bg-secondary-container w-[300px] h-[300px] bottom-0 -right-16" />
      </div>

      {/* Sidebar */}
      <aside
        className={`relative z-20 flex flex-col border-r border-white/5 bg-surface-container-lowest/80 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
          </div>
          {sidebarOpen && (
            <span className="text-xl font-black font-headline text-white tracking-tight">Voxify</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${
                item.id === 'new'
                  ? 'bg-primary-container/20 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Back to landing + collapse toggle */}
        <div className="px-2 pb-4 space-y-1 border-t border-white/5 pt-4">
          {sidebarOpen && (
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-xl flex-shrink-0">home</span>
              <span>Home</span>
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">
              {sidebarOpen ? 'chevron_left' : 'chevron_right'}
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative z-10 p-8">
        {/* ── IDLE / FILE SELECTED ── */}
        {status === 'idle' && (
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
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
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
                onClick={handleTranscribe}
                disabled={!file}
                className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                  file
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
        )}

        {/* ── UPLOADING ── */}
        {status === 'uploading' && (
          <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary-container/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-container animate-spin" />
              <div className="absolute inset-3 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Encrypting & Uploading…</h2>
              <p className="text-on-surface-variant">Establishing zero-trust connection to secure storage</p>
            </div>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {status === 'processing' && (
          <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-secondary-container/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary-container animate-spin" />
              <div className="absolute inset-3 rounded-full bg-secondary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI is Transcribing on GPU…</h2>
              <p className="text-on-surface-variant">Whisper Large-v3 Model · Speaker Diarization active</p>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {status === 'done' && (
          <div className="max-w-5xl mx-auto pt-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold font-headline text-white">Transcription Ready</h1>
                <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  Ephemeral data purged from servers
                </p>
              </div>
              <button onClick={reset} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-lg">add</span>
                New Transcription
              </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Player */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 h-fit">
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Audio Player</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>audio_file</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface text-sm font-medium truncate">
                      {file?.name ?? 'interview_recording.mp3'}
                    </p>
                    <p className="text-on-surface-variant text-xs">04:32</p>
                  </div>
                </div>

                {/* Waveform (decorative) */}
                <div className="flex items-center gap-0.5 h-12 mb-4">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${i < 28 ? 'bg-secondary' : 'bg-surface-container-high'}`}
                      style={{ height: `${20 + Math.sin(i * 0.7) * 15 + Math.random() * 15}%` }}
                    />
                  ))}
                </div>

                {/* Scrubber */}
                <div className="h-1 bg-surface-container-high rounded-full mb-1 overflow-hidden">
                  <div className="h-full w-[58%] bg-gradient-to-r from-primary-container to-secondary rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant font-mono mb-6">
                  <span>02:38</span><span>04:32</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined">skip_previous</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center hover:opacity-90 transition-all" style={{ boxShadow: '0 0 16px rgba(108,92,231,0.4)' }}>
                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                  </button>
                  <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined">skip_next</span>
                  </button>
                </div>

                {/* Export */}
                <div className="space-y-2">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">Export</p>
                  {[
                    { icon: 'content_copy', label: 'Copy Text' },
                    { icon: 'download',     label: 'Download .TXT' },
                    { icon: 'subtitles',    label: 'Download .SRT' },
                  ].map((btn) => (
                    <button key={btn.label} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface">
                      <span className="material-symbols-outlined text-lg text-on-surface-variant">{btn.icon}</span>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-white/5">
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Transcript</h3>
                <div className="space-y-4">
                  {MOCK_TRANSCRIPT.map((seg, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveSegment(i)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                        activeSegment === i
                          ? 'border-primary-container/40 bg-primary-container/10'
                          : 'border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            seg.speaker === 'Speaker 1'
                              ? 'bg-primary-container/20 text-primary'
                              : 'bg-secondary-container/20 text-secondary'
                          }`}
                        >
                          {seg.speaker}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">{seg.start}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${activeSegment === i ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
