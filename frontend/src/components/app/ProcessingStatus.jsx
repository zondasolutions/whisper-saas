import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PIPELINE_STEPS = [
    { id: 'upload',      icon: 'cloud_upload', titleKey: 'processing.uploadTitle',      subtitleKey: 'processing.uploadSubtitle',      color: 'primary' },
    { id: 'cleaning',    icon: 'graphic_eq',   titleKey: 'processing.cleaningTitle',    subtitleKey: 'processing.cleaningSubtitle',    color: 'tertiary' },
    { id: 'transcribing',icon: 'psychology',   titleKey: 'processing.transcribingTitle',subtitleKey: 'processing.transcribingSubtitle',color: 'secondary' },
    { id: 'diarizing',   icon: 'group',        titleKey: 'processing.diarizingTitle',   subtitleKey: 'processing.diarizingSubtitle',   color: 'primary' },
];



export default function ProcessingStatus({ status }) {
    const [activeStep, setActiveStep] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const { t } = useTranslation();

    // Elapsed time counter
    useEffect(() => {
        setElapsed(0);
        const interval = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Phrase cycler
    useEffect(() => {
        if (status === 'processing') {
            const interval = setInterval(() => {
                setPhraseIndex(prev => (prev + 1) % 6);
            }, 3500);
            return () => clearInterval(interval);
        }
    }, [status]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (status === 'uploading') {
            setActiveStep(0);
            return;
        }

        // When processing starts, cycle through the GPU pipeline steps
        if (status === 'processing') {
            setActiveStep(1);
            const timers = [
                setTimeout(() => setActiveStep(2), 6000),
                setTimeout(() => setActiveStep(3), 14000),
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [status]);

    const currentStep = PIPELINE_STEPS[activeStep];

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 text-center" style={{ animation: 'fade-in 0.5s ease-out' }}>
            {/* Spinner and Waveform */}
            <div className="relative flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6">
                    <div className={`absolute inset-0 rounded-full border-4 border-${currentStep.color}-container/20`} />
                    <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin border-t-${currentStep.color}-container`} />
                    <div className={`absolute inset-3 rounded-full flex items-center justify-center bg-${currentStep.color}-container/10 transition-colors duration-500`}>
                        <span className={`material-symbols-outlined text-3xl text-${currentStep.color}`}>
                            {currentStep.icon}
                        </span>
                    </div>
                </div>
                
                {/* Dynamic Waveform */}
                {status === 'processing' && (
                    <div className="flex items-center justify-center gap-1.5 h-12 mb-4 w-32 border-b border-white/5 pb-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div 
                                key={i} 
                                className={`w-1.5 bg-${currentStep.color} rounded-full transition-all duration-300`} 
                                style={{ 
                                    height: `${20 + Math.random() * 80}%`,
                                    animation: `pulse 1s infinite alternate ${i * 0.15}s`
                                }} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Elapsed Timer & Dynamic Phrases */}
            <div className="flex flex-col items-center gap-2 min-h-[4rem]">
                <p className="text-on-surface-variant font-mono text-xl tracking-widest bg-surface-container/50 px-4 py-1.5 rounded-full shadow-inner">{formatTime(elapsed)}</p>
                {status === 'processing' && (
                    <p key={phraseIndex} className="text-secondary text-sm font-medium tracking-wide opacity-100 transition-opacity duration-1000 ease-in" style={{ animation: 'none' }}>
                        {t(`processing.dynamic${phraseIndex + 1}`)}
                    </p>
                )}
            </div>

            {/* Title */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight transition-colors">{t(currentStep.titleKey)}</h2>
                <p className="text-on-surface-variant text-base">{t(currentStep.subtitleKey)}</p>
            </div>

            {/* Pipeline Progress */}
            <div className="w-full max-w-lg mt-6 bg-surface-container/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                    {PIPELINE_STEPS.map((step, i) => (
                        <div key={step.id} className="flex-1 flex flex-col items-center gap-3">
                            <div className={`w-full h-2 rounded-full transition-all duration-700 ${
                                i < activeStep
                                    ? 'bg-secondary'
                                    : i === activeStep
                                        ? 'bg-gradient-to-r from-primary-container to-secondary shadow-[0_0_10px_rgba(var(--color-secondary),0.5)] animate-pulse'
                                        : 'bg-surface-container-high'
                            }`} />
                            <span className={`material-symbols-outlined text-lg transition-colors duration-500 flex items-center justify-center w-8 h-8 rounded-full ${
                                i <= activeStep ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant/40 bg-transparent'
                            }`}>
                                {i < activeStep ? 'check_circle' : step.icon}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scaleY(0.4); opacity: 0.5; }
                    100% { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
