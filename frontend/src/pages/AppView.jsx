import { useState } from 'react';
import { apiClient } from '../api/client';
import { useToast } from '../components/common/Toast';
import Orb from '../components/common/Orb';
import Sidebar from '../components/layout/Sidebar';
import UploadArea from '../components/app/UploadArea';
import ProcessingStatus from '../components/app/ProcessingStatus';
import TranscriptionResult from '../components/app/TranscriptionResult';
import HistoryView from '../components/app/HistoryView';
import SettingsView from '../components/app/SettingsView';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AppView() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState('new'); // 'new' | 'history' | 'settings'
    const [status, setStatus] = useState('idle'); // idle | uploading | processing | done
    const [file, setFile] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0); // Stores duration from UploadArea
    const [diarizationOptions, setDiarizationOptions] = useState({ numSpeakers: '', minSpeakers: '', maxSpeakers: '', initialPrompt: '' });
    const [result, setResult] = useState(null);
    const [cleanAudioUrl, setCleanAudioUrl] = useState(null);
    const [processingTimeMs, setProcessingTimeMs] = useState(null);
    const { showToast } = useToast();
    const { isLoggedIn, user } = useAuth();
    const { t } = useTranslation();

    const handleTranscribe = async () => {
        if (!file) return;

        const startTime = Date.now();
        try {
            setStatus('uploading');
            // Step 1 & 2: Get presigned URL and upload directly to R2
            const uploadRes = await apiClient.upload(file);
            const fileKey = uploadRes.file_key;

            setStatus('processing');
            // Step 3: Submit transcription job to RunPod via backend
            const transcribeRes = await apiClient.transcribe(fileKey, audioDuration, diarizationOptions);
            const jobId = transcribeRes.job_id;

            // Step 4: Poll for result (every 3s, timeout after 15 min)
            const MAX_POLLS = 300;
            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const statusRes = await apiClient.getStatus(jobId);

                if (statusRes.status === 'completed') {
                    const elapsed = Date.now() - startTime;
                    setProcessingTimeMs(elapsed);
                    setResult(statusRes.transcript);
                    setCleanAudioUrl(statusRes.clean_audio_url || null);
                    setStatus('done');

                    if (isLoggedIn && user?.id) {
                        try {
                            const historyKey = `whisper_history_v1_${user.id}`;
                            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

                            let dur = "00:00";
                            if (statusRes.transcript?.segments?.length > 0) {
                                const lastSeg = statusRes.transcript.segments[statusRes.transcript.segments.length - 1];
                                const s = lastSeg.start + 5;
                                const m = Math.floor(s / 60);
                                const sec = Math.floor(s % 60);
                                dur = `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                            }

                            history.unshift({
                                id: Date.now().toString(),
                                name: file.name,
                                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                duration: dur,
                                status: 'Completed',
                                result: statusRes.transcript
                            });
                            localStorage.setItem(historyKey, JSON.stringify(history));
                        } catch (e) {
                            console.error('Failed to save history', e);
                        }
                    } else {
                        showToast(t('appView.notSaved'), 'info');
                    }

                    showToast(t('appView.completed'), 'success');
                    return;
                } else if (statusRes.status === 'failed') {
                    throw new Error(statusRes.error || t('appView.error'));
                } else if (statusRes.status === 'local_mode') {
                    // Dev mode: RunPod not configured, show placeholder result
                    setResult({
                        segments: [
                            { speaker: 'Speaker 1', start: 0, text: 'Backend connected. Configure RUNPOD_API_KEY to enable real GPU transcription.' }
                        ]
                    });
                    setStatus('done');
                    showToast(t('appView.localMode'), 'success');
                    return;
                }
                // status === 'processing' → keep polling
            }
            throw new Error(t('appView.timeout'));
        } catch (error) {
            console.error(error);
            showToast(error.message || t('appView.error'), 'error');
            setStatus('idle');
        }
    };


    const reset = () => {
        setFile(null);
        setResult(null);
        setCleanAudioUrl(null);
        setProcessingTimeMs(null);
        setStatus('idle');
        setDiarizationOptions({ numSpeakers: '', minSpeakers: '', maxSpeakers: '', initialPrompt: '' });
    };

    return (
        <div className="flex h-screen bg-background text-on-background overflow-hidden relative">
            {/* Ambient orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <Orb className="bg-primary-container w-[400px] h-[400px] -top-32 -left-16 absolute" />
                <Orb className="bg-secondary-container w-[300px] h-[300px] bottom-0 -right-16 absolute" />
            </div>

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentView={currentView}
                setCurrentView={setCurrentView}
            />

            <main className="flex-1 overflow-y-auto relative z-10 p-8">
                {currentView === 'new' && (
                    <>
                        {status === 'idle' && (
                            <UploadArea
                                file={file}
                                setFile={setFile}
                                setAudioDuration={setAudioDuration}
                                onTranscribe={handleTranscribe}
                                diarizationOptions={diarizationOptions}
                                setDiarizationOptions={setDiarizationOptions}
                            />
                        )}

                        {(status === 'uploading' || status === 'processing') && (
                            <ProcessingStatus status={status} />
                        )}

                        {status === 'done' && (
                            <TranscriptionResult result={result} file={file} onReset={reset} cleanAudioUrl={cleanAudioUrl} processingTimeMs={processingTimeMs} />
                        )}
                    </>
                )}

                {currentView === 'history' && <HistoryView onViewResult={(item) => {
                    setResult(item.result);
                    setFile({ name: item.name });
                    setStatus('done');
                    setCurrentView('new');
                }} />}

                {currentView === 'settings' && <SettingsView />}
            </main>
        </div>
    );
}
