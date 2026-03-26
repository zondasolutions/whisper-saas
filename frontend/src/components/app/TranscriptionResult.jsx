import { useState } from 'react';

export default function TranscriptionResult({ result, file, onReset }) {
    const [activeSegment, setActiveSegment] = useState(null);
    const segments = result?.segments || [];

    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-5xl mx-auto pt-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-white">Transcription Ready</h1>
                    <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        Ephemeral data purged from servers
                    </p>
                </div>
                <button onClick={onReset} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 px-4 py-2 rounded-full">
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
                                {file?.name ?? 'uploaded_audio.mp3'}
                            </p>
                            <p className="text-on-surface-variant text-xs">--:--</p>
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
                        <span>00:00</span><span>--:--</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                            <span className="material-symbols-outlined">skip_previous</span>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center hover:opacity-90 transition-all" style={{ boxShadow: '0 0 16px rgba(108,92,231,0.4)' }}>
                            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
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
                            { icon: 'download', label: 'Download .TXT' },
                            { icon: 'subtitles', label: 'Download .SRT' },
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
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {segments.length > 0 ? (
                            segments.map((seg, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveSegment(i)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${activeSegment === i
                                            ? 'border-primary-container/40 bg-primary-container/10'
                                            : 'border-transparent hover:bg-surface-container'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${seg.speaker?.includes('1') || i % 2 === 0
                                                    ? 'bg-primary-container/20 text-primary'
                                                    : 'bg-secondary-container/20 text-secondary'
                                                }`}
                                        >
                                            {seg.speaker || `Speaker ${i % 2 === 0 ? 1 : 2}`}
                                        </span>
                                        <span className="text-xs text-on-surface-variant font-mono">{formatTime(seg.start)}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${activeSegment === i ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                        {seg.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-on-surface-variant text-sm italic py-4">
                                No transcription segments available. The full text might be available instead.
                            </p>
                        )}
                        {/* Fallback to full text if no segments */}
                        {segments.length === 0 && result?.text && (
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {result.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
