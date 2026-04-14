import { useState, useRef, useEffect } from 'react';
import { useToast } from '../common/Toast';
import { useTranslation } from 'react-i18next';

export default function TranscriptionResult({ result, file, onReset, cleanAudioUrl, processingTimeMs }) {
    const [activeSegment, setActiveSegment] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const { showToast } = useToast();
    const { t } = useTranslation();

    const segments = result?.segments || [];

    // Helper for "completed in" text
    const formatProcessingTime = (ms) => {
        if (!ms) return '';
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    // Create object URL for audio file
    useEffect(() => {
        if (!file || !audioRef.current || !(file instanceof File || file instanceof Blob)) return;
        const objectUrl = URL.createObjectURL(file);
        audioRef.current.src = objectUrl;

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    // Track active segment based on audio time
    useEffect(() => {
        if (!segments || segments.length === 0) return;

        let found = false;
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const nextSeg = segments[i + 1];
            if (currentTime >= seg.start && (!nextSeg || currentTime < nextSeg.start)) {
                setActiveSegment(i);
                found = true;
                break;
            }
        }
        if (!found && currentTime === 0) {
            setActiveSegment(null);
        }
    }, [currentTime, segments]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleScrubberClick = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSegmentClick = (index, startTime) => {
        setActiveSegment(index);
        if (audioRef.current) {
            audioRef.current.currentTime = startTime;
            setCurrentTime(startTime);
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Exports
    const generatePlainText = () => {
        if (!segments.length && result?.text) return result.text;
        return segments.map((s, i) => `[${s.speaker || `${t('result.speaker')} ${i % 2 === 0 ? 1 : 2}`}] ${formatTime(s.start)}: ${s.text}`).join('\n\n');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatePlainText());
        showToast(t('result.copiedToast'), 'success');
    };

    const downloadFile = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadTXT = () => {
        downloadFile(generatePlainText(), `${file?.name || 'transcription'}.txt`, 'text/plain');
        showToast(t('result.txtDownload'), 'success');
    };

    const handleDownloadSRT = () => {
        if (!segments || segments.length === 0) {
            showToast(t('result.noSrtSegments'), 'error');
            return;
        }

        const formatSRTTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 1000);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
        };

        const srtContent = segments.map((s, i) => {
            const nextStart = segments[i + 1]?.start || s.start + 5; // Fallback +5s if last
            return `${i + 1}\n${formatSRTTime(s.start)} --> ${formatSRTTime(nextStart)}\n${s.speaker ? s.speaker + ': ' : ''}${s.text.trim()}\n`;
        }).join('\n');

        downloadFile(srtContent, `${file?.name || 'transcription'}.srt`, 'text/plain');
        showToast(t('result.srtDownload'), 'success');
    };

    return (
        <div className="max-w-5xl mx-auto pt-4">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-white">{t('result.title')}</h1>
                    <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4 sm:items-center">
                        <p className="text-xs text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            {t('result.purged')}
                        </p>
                        {processingTimeMs && (
                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">timer</span>
                                {t('result.completedIn', { time: formatProcessingTime(processingTimeMs) })}
                            </p>
                        )}
                    </div>
                </div>
                <button onClick={onReset} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 px-4 py-2 rounded-full">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('result.newTranscription')}
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Player */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 h-fit">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">{t('result.audioPlayer')}</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>audio_file</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-on-surface text-sm font-medium truncate">
                                {file?.name ?? 'uploaded_audio.mp3'}
                            </p>
                            <p className="text-on-surface-variant text-xs">{formatTime(duration)}</p>
                        </div>
                    </div>

                    {/* Waveform (decorative) */}
                    <div className="flex items-center gap-0.5 h-12 mb-4">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-full transition-all ${i / 48 <= (currentTime / (duration || 1)) ? 'bg-secondary' : 'bg-surface-container-high'}`}
                                style={{ height: `${20 + Math.sin(i * 0.7) * 15 + Math.random() * 15}%` }}
                            />
                        ))}
                    </div>

                    {/* Scrubber */}
                    <div className="h-2 bg-surface-container-high rounded-full mb-1 overflow-hidden cursor-pointer" onClick={handleScrubberClick}>
                        <div
                            className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-all"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant font-mono mb-6">
                        <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button className="text-on-surface-variant hover:text-on-surface transition-colors" onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 10; }}>
                            <span className="material-symbols-outlined">replay_10</span>
                        </button>
                        <button onClick={togglePlayPause} className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center hover:opacity-90 transition-all" style={{ boxShadow: '0 0 16px rgba(108,92,231,0.4)' }}>
                            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-on-surface transition-colors" onClick={() => { if(audioRef.current) audioRef.current.currentTime += 10; }}>
                            <span className="material-symbols-outlined">forward_10</span>
                        </button>
                    </div>

                    {/* Export */}
                    <div className="space-y-2">
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">{t('result.export')}</p>

                        <button onClick={handleCopy} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface">
                            <span className="material-symbols-outlined text-lg text-on-surface-variant">content_copy</span>
                            {t('result.copyText')}
                        </button>
                        <button onClick={handleDownloadTXT} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface">
                            <span className="material-symbols-outlined text-lg text-on-surface-variant">download</span>
                            {t('result.downloadTxt')}
                        </button>
                        <button onClick={handleDownloadSRT} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface">
                            <span className="material-symbols-outlined text-lg text-on-surface-variant">subtitles</span>
                            {t('result.downloadSrt')}
                        </button>
                    </div>

                    {/* Clean Audio Player (Admin Only) */}
                    {cleanAudioUrl && (
                        <div className="mt-4 pt-4 border-t border-outline-variant/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-lg text-secondary">graphic_eq</span>
                                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">{t('result.cleanAudio')}</p>
                                <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">DeepFilterNet3</span>
                            </div>
                            <audio
                                controls
                                src={cleanAudioUrl}
                                className="w-full h-10 rounded-lg"
                                style={{ filter: 'hue-rotate(90deg)' }}
                            />
                            <p className="text-xs text-on-surface-variant mt-2">
                                {t('result.cleanAudioHint')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Transcript */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-white/5">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">{t('result.transcript')}</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 relative" id="transcript-container">
                        {segments.length > 0 ? (
                            segments.map((seg, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSegmentClick(i, seg.start)}
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
                                            {seg.speaker || `${t('result.speaker')} ${i % 2 === 0 ? 1 : 2}`}
                                        </span>
                                        <span className="text-xs text-on-surface-variant font-mono">{formatTime(seg.start)}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${activeSegment === i ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                                        {seg.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-on-surface-variant text-sm italic py-4">
                                {t('result.noSegments')}
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
