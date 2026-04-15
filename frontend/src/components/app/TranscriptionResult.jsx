import { useState, useRef, useEffect } from 'react';
import { useToast } from '../common/Toast';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../context/AuthContext';

export default function TranscriptionResult({ result, file, onReset, cleanAudioUrl, processingTimeMs }) {
    const [activeSegment, setActiveSegment] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [editableSegments, setEditableSegments] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");
    
    const audioRef = useRef(null);
    const { showToast } = useToast();
    const { t } = useTranslation();
    const { user } = useAuth();
    
    // Fallback/loose checking for premium since actual tier might be different but "Admin/Premium" are usual
    const isPremium = user?.is_admin || user?.tier === 'Premium' || user?.is_premium || false;

    useEffect(() => {
        setEditableSegments(result?.segments || []);
    }, [result]);

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
        if (!editableSegments || editableSegments.length === 0) return;

        let found = false;
        for (let i = 0; i < editableSegments.length; i++) {
            const seg = editableSegments[i];
            const nextSeg = editableSegments[i + 1];
            if (currentTime >= seg.start && (!nextSeg || currentTime < nextSeg.start)) {
                setActiveSegment(i);
                found = true;
                break;
            }
        }
        if (!found && currentTime === 0) {
            setActiveSegment(null);
        }
    }, [currentTime, editableSegments]);

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
        if (editingIndex !== null) return; // Prevent navigation while editing
        setActiveSegment(index);
        if (audioRef.current) {
            audioRef.current.currentTime = startTime;
            setCurrentTime(startTime);
            audioRef.current.play();
            setIsPlaying(true);
        }
    };
    
    // Stable color hash for speakers
    const getSpeakerColor = (speakerName) => {
        if (!speakerName) return 'bg-primary-container/20 text-primary border border-primary/20';
        let hash = 0;
        for (let i = 0; i < speakerName.length; i++) {
            hash = speakerName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = [
            'bg-primary-container/20 text-primary border border-primary/20',
            'bg-secondary-container/20 text-secondary border border-secondary/20',
            'bg-tertiary-container/30 text-tertiary-light border border-tertiary/20',
            'bg-error-container/20 text-error border border-error/20',
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
            'bg-blue-500/20 text-blue-400 border border-blue-500/20',
            'bg-amber-500/20 text-amber-400 border border-amber-500/20',
            'bg-purple-500/20 text-purple-400 border border-purple-500/20'
        ];
        return colors[Math.abs(hash) % colors.length];
    };

    // Edit logic
    const handleEditStart = (index, currentText) => {
        setEditingIndex(index);
        setEditValue(currentText);
    };

    const handleEditSave = (index) => {
        const newSegments = [...editableSegments];
        newSegments[index].text = editValue;
        setEditableSegments(newSegments);
        setEditingIndex(null);
    };

    // Exports
    const generatePlainText = () => {
        if (!editableSegments.length && result?.text) return result.text;
        return editableSegments.map((s, i) => `[${s.speaker || `${t('result.speaker')} ${i % 2 === 0 ? 1 : 2}`}] ${formatTime(s.start)}: ${s.text}`).join('\n\n');
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
        showToast(t('result.txtDownload', 'TXT Downloaded'), 'success');
    };

    const handleDownloadSRT = () => {
        if (!editableSegments || editableSegments.length === 0) {
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

        const srtContent = editableSegments.map((s, i) => {
            const nextStart = editableSegments[i + 1]?.start || s.start + 5;
            return `${i + 1}\n${formatSRTTime(s.start)} --> ${formatSRTTime(nextStart)}\n${s.speaker ? s.speaker + ': ' : ''}${s.text.trim()}\n`;
        }).join('\n');

        downloadFile(srtContent, `${file?.name || 'transcription'}.srt`, 'text/plain');
        showToast(t('result.srtDownload', 'SRT Downloaded'), 'success');
    };

    const handleDownloadVTT = () => {
        if (!editableSegments || editableSegments.length === 0) return;

        const formatVTTTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 1000);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
        };

        const vttContent = "WEBVTT\n\n" + editableSegments.map((s, i) => {
            const nextStart = editableSegments[i + 1]?.start || s.start + 5;
            return `${formatVTTTime(s.start)} --> ${formatVTTTime(nextStart)}\n<v ${s.speaker || 'Speaker'}>${s.text.trim()}\n`;
        }).join('\n');

        downloadFile(vttContent, `${file?.name || 'transcription'}.vtt`, 'text/vtt');
        showToast("VTT Downloaded", 'success');
    };

    const handleDownloadPDF = () => {
        if (!isPremium) {
            showToast("PDF Export is a Premium feature", 'error');
            return;
        }
        try {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Transcription Result", 10, 20);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            let y = 30;
            
            const lines = doc.splitTextToSize(generatePlainText(), 180);
            for (let i = 0; i < lines.length; i++) {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines[i], 10, y);
                y += 7;
            }
            
            doc.save(`${file?.name || 'transcription'}.pdf`);
            showToast("PDF Downloaded", 'success');
        } catch (error) {
            console.error("PDF generation failed", error);
            showToast("PDF Failed", 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-4 relative animate-fade-in">
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
                <button onClick={onReset} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 px-4 py-2 rounded-full hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('result.newTranscription')}
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Player */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 h-fit sticky top-4">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">{t('result.audioPlayer')}</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
                            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>audio_file</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-on-surface text-sm font-medium truncate">
                                {file?.name ?? 'uploaded_audio.mp3'}
                            </p>
                            <p className="text-on-surface-variant text-xs font-mono">{formatTime(duration)}</p>
                        </div>
                    </div>

                    {/* Waveform (decorative) */}
                    <div className="flex items-center gap-0.5 h-12 mb-4">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-full transition-all ${i / 48 <= (currentTime / (duration || 1)) ? 'bg-secondary shadow-[0_0_8px_rgba(var(--color-secondary),0.6)]' : 'bg-surface-container-high'}`}
                                style={{ height: `${20 + Math.sin(i * 0.7) * 15 + Math.random() * 15}%` }}
                            />
                        ))}
                    </div>

                    {/* Scrubber */}
                    <div className="h-2.5 bg-surface-container-high rounded-full mb-1 overflow-hidden cursor-pointer hover:h-3 transition-all" onClick={handleScrubberClick}>
                        <div
                            className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-all relative"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow" />
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant font-mono mb-6">
                        <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button className="text-on-surface-variant hover:text-white transition-colors" onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 10; }}>
                            <span className="material-symbols-outlined text-3xl">replay_10</span>
                        </button>
                        <button onClick={togglePlayPause} className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center hover:scale-105 transition-transform" style={{ boxShadow: '0 0 20px rgba(108,92,231,0.4)' }}>
                            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-white transition-colors" onClick={() => { if(audioRef.current) audioRef.current.currentTime += 10; }}>
                            <span className="material-symbols-outlined text-3xl">forward_10</span>
                        </button>
                    </div>

                    {/* Export Section */}
                    <div className="space-y-2 mt-4">
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3 font-semibold">{t('result.export', 'Export')}</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                             <button onClick={handleDownloadTXT} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface border border-white/5 hover:border-white/10">
                                <span className="material-symbols-outlined text-lg text-on-surface-variant">description</span>
                                TXT
                            </button>
                            <button onClick={handleDownloadSRT} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface border border-white/5 hover:border-white/10">
                                <span className="material-symbols-outlined text-lg text-on-surface-variant">subtitles</span>
                                SRT
                            </button>
                            <button onClick={handleDownloadVTT} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-sm text-on-surface border border-white/5 hover:border-white/10">
                                <span className="material-symbols-outlined text-lg text-on-surface-variant">closed_caption</span>
                                VTT
                            </button>
                            <button onClick={handleDownloadPDF} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container transition-all text-sm text-on-surface border border-white/5 relative overflow-hidden ${isPremium ? 'hover:bg-surface-container-high hover:border-white/10' : 'opacity-60 cursor-not-allowed grayscale'}`}>
                                <span className="material-symbols-outlined text-lg text-on-surface-variant">picture_as_pdf</span>
                                PDF
                                {!isPremium && <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[1px]"><span className="material-symbols-outlined text-sm text-error">lock</span></div>}
                            </button>
                        </div>
                    </div>

                    {/* Clean Audio Player (Admin Only) */}
                    {cleanAudioUrl && (
                        <div className="mt-6 pt-4 border-t border-outline-variant/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-lg text-secondary">graphic_eq</span>
                                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">{t('result.cleanAudio')}</p>
                                <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full border border-secondary/30">DeepFilterNet3</span>
                            </div>
                            <audio
                                controls
                                src={cleanAudioUrl}
                                className="w-full h-10 rounded-lg"
                                style={{ filter: 'hue-rotate(90deg)' }}
                            />
                            <p className="text-xs text-on-surface-variant/70 mt-2">
                                {t('result.cleanAudioHint', 'Raw cleaned audio format')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Transcript */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-white/5 flex flex-col h-fit md:h-[calc(100vh-140px)]">
                    <div className="flex items-center justify-between mb-4">
                         <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">{t('result.transcript', 'Transcript')}</h3>
                         <span className="text-xs text-on-surface-variant/60 bg-surface-container-high px-2 py-1 rounded-lg">Double-click to edit</span>
                    </div>
                   
                    <div className="space-y-4 overflow-y-auto pr-2 relative flex-1 custom-scrollbar" id="transcript-container">
                        {editableSegments.length > 0 ? (
                            editableSegments.map((seg, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSegmentClick(i, seg.start)}
                                    onDoubleClick={() => handleEditStart(i, seg.text)}
                                    className={`p-4 rounded-xl cursor-default transition-all duration-200 border group ${
                                            activeSegment === i
                                            ? 'border-primary-container/40 bg-primary-container/10 shadow-[0_4px_20px_rgba(var(--color-primary),0.05)]'
                                            : 'border-transparent hover:bg-surface-container border-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${getSpeakerColor(seg.speaker)}`}
                                            >
                                                {seg.speaker || `${t('result.speaker')} ${i % 2 === 0 ? 1 : 2}`}
                                            </span>
                                            <span className="text-xs text-on-surface-variant font-mono bg-surface-container-high px-2 py-0.5 rounded-md">{formatTime(seg.start)}</span>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEditStart(i, seg.text); }}
                                                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                                title="Edit segment"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {editingIndex === i ? (
                                        <div className="mt-2 text-sm leading-relaxed" onClick={e => e.stopPropagation()}>
                                            <textarea
                                                className="w-full bg-surface-container-high border border-primary/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                rows={Math.max(2, editValue.split('\n').length)}
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleEditSave(i);
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setEditingIndex(null);
                                                    }
                                                }}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setEditingIndex(null)} className="text-xs px-3 py-1.5 text-on-surface-variant hover:text-white transition-colors">Cancel</button>
                                                <button onClick={() => handleEditSave(i)} className="text-xs px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors font-medium">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={`text-sm leading-relaxed ${activeSegment === i ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                                            {seg.text}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-on-surface-variant text-sm italic py-4">
                                {t('result.noSegments')}
                            </p>
                        )}
                        {/* Fallback to full text if no segments */}
                        {editableSegments.length === 0 && result?.text && (
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {result.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}
