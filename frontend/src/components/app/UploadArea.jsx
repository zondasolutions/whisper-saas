import { useRef, useState } from 'react';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function UploadArea({ file, setFile, setAudioDuration, onTranscribe, diarizationOptions, setDiarizationOptions }) {
    const [isDragging, setIsDragging] = useState(false);
    const [promptOpen, setPromptOpen] = useState(false);
    const fileInputRef = useRef(null);
    const { showToast } = useToast();
    const { isLoggedIn } = useAuth();
    const { t } = useTranslation();

    const validateAndSetFile = (f) => {
        if (!f) return;

        const audio = new Audio();
        const objectUrl = URL.createObjectURL(f);

        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(objectUrl);
            const duration = audio.duration;
            const limitSeconds = 3 * 60;

            if (!isLoggedIn && duration > limitSeconds) {
                showToast(
                    t('upload.freeToastError', {
                        minutes: Math.floor(duration / 60),
                        seconds: Math.floor(duration % 60),
                    }),
                    'error'
                );
                return;
            }
            if (setAudioDuration) setAudioDuration(duration);
            setFile(f);
        };
        audio.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setFile(f); // Fallback if metadata read fails
        }
        audio.src = objectUrl;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        validateAndSetFile(f);
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        validateAndSetFile(f);
        // Reset input so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-2xl mx-auto pt-8">
            <h1 className="text-3xl font-bold font-headline text-white mb-2">{t('upload.title')}</h1>
            <p className="text-on-surface-variant mb-10">{t('upload.subtitle')}</p>

            {/* Big upload button */}
            <button
                onClick={() => fileInputRef.current.click()}
                className="w-full btn-primary justify-center mb-6 text-xl py-5"
            >
                <span className="material-symbols-outlined text-2xl">upload_file</span>
                {t('upload.uploadBtn')}
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
                        <p className="text-on-surface font-semibold text-lg mb-1">{t('upload.dragDrop')}</p>
                        <p className="text-on-surface-variant text-sm">{t('upload.formatHint')}</p>
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

            {file && (
                <div className="mt-8 p-6 bg-surface border border-outline-variant/30 rounded-2xl flex flex-col gap-4 text-left">
                    <div>
                        <h3 className="text-lg font-semibold text-on-surface">{t('upload.diarizationTitle')}</h3>
                        <p className="text-sm text-on-surface-variant">{t('upload.diarizationHint')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">{t('upload.exactSpeakers')}</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-surface-container text-on-surface px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Auto"
                                value={diarizationOptions?.numSpeakers || ''}
                                onChange={(e) => setDiarizationOptions(prev => ({ ...prev, numSpeakers: e.target.value, minSpeakers: '', maxSpeakers: '' }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">{t('upload.minSpeakers')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-surface-container text-on-surface px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                    placeholder="Auto"
                                    disabled={!!diarizationOptions?.numSpeakers}
                                    value={diarizationOptions?.numSpeakers ? '' : (diarizationOptions?.minSpeakers || '')}
                                    onChange={(e) => setDiarizationOptions(prev => ({ ...prev, minSpeakers: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">{t('upload.maxSpeakers')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-surface-container text-on-surface px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                    placeholder="Auto"
                                    disabled={!!diarizationOptions?.numSpeakers}
                                    value={diarizationOptions?.numSpeakers ? '' : (diarizationOptions?.maxSpeakers || '')}
                                    onChange={(e) => setDiarizationOptions(prev => ({ ...prev, maxSpeakers: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Context Prompt Section */}
                    <div className="border-t border-outline-variant/20 pt-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setPromptOpen(prev => !prev)}
                            className="flex items-center gap-2 w-full text-left group"
                        >
                            <span className={`material-symbols-outlined text-base text-on-surface-variant transition-transform duration-200 ${promptOpen ? 'rotate-90' : ''}`}>
                                chevron_right
                            </span>
                            <h3 className="text-base font-semibold text-on-surface">{t('upload.contextPromptTitle')}</h3>
                            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{t('upload.contextPromptBadge')}</span>
                        </button>
                        <p className="text-sm text-on-surface-variant mt-1 ml-6">{t('upload.contextPromptHint')}</p>

                        {promptOpen && (
                            <textarea
                                className="w-full mt-3 bg-surface-container text-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm leading-relaxed placeholder:text-on-surface-variant/50"
                                rows={3}
                                maxLength={500}
                                placeholder={t('upload.contextPromptPlaceholder')}
                                value={diarizationOptions?.initialPrompt || ''}
                                onChange={(e) => setDiarizationOptions(prev => ({ ...prev, initialPrompt: e.target.value }))}
                            />
                        )}
                    </div>
                </div>
            )}

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
                    {t('upload.transcribeBtn')}
                </button>
                <p className="text-xs text-on-surface-variant mt-3">{t('upload.freeLimit')}</p>
            </div>
        </div>
    );
}
