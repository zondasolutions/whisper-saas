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
    const { t } = useTranslation();

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
        <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 text-center">
            {/* Spinner */}
            <div className="relative w-20 h-20">
                <div className={`absolute inset-0 rounded-full border-4 border-${currentStep.color}-container/20`} />
                <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin border-t-${currentStep.color}-container`} />
                <div className={`absolute inset-3 rounded-full flex items-center justify-center bg-${currentStep.color}-container/10`}>
                    <span className={`material-symbols-outlined text-2xl text-${currentStep.color}`}>
                        {currentStep.icon}
                    </span>
                </div>
            </div>

            {/* Title */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">{t(currentStep.titleKey)}</h2>
                <p className="text-on-surface-variant">{t(currentStep.subtitleKey)}</p>
            </div>

            {/* Pipeline Progress */}
            <div className="w-full max-w-md mt-4">
                <div className="flex items-center justify-between gap-1">
                    {PIPELINE_STEPS.map((step, i) => (
                        <div key={step.id} className="flex-1 flex flex-col items-center gap-2">
                            <div className={`w-full h-1.5 rounded-full transition-all duration-700 ${
                                i < activeStep
                                    ? 'bg-secondary'
                                    : i === activeStep
                                        ? 'bg-gradient-to-r from-primary-container to-secondary animate-pulse'
                                        : 'bg-surface-container-high'
                            }`} />
                            <span className={`material-symbols-outlined text-base transition-colors duration-500 ${
                                i <= activeStep ? 'text-secondary' : 'text-on-surface-variant/40'
                            }`}>
                                {i < activeStep ? 'check_circle' : step.icon}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
