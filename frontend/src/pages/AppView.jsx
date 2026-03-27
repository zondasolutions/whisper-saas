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

export default function AppView() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState('new'); // 'new' | 'history' | 'settings'
    const [status, setStatus] = useState('idle'); // idle | uploading | processing | done
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const { showToast } = useToast();

    const handleTranscribe = async () => {
        if (!file) return;

        try {
            setStatus('uploading');
            // Step 1 & 2: Get presigned URL and upload directly to R2
            const uploadRes = await apiClient.upload(file);
            const fileKey = uploadRes.file_key;

            setStatus('processing');
            // Step 3: Submit transcription job to RunPod via backend
            const transcribeRes = await apiClient.transcribe(fileKey);
            const jobId = transcribeRes.job_id;

            // Step 4: Poll for result (every 3s, timeout after 5 min)
            const MAX_POLLS = 100;
            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const statusRes = await apiClient.getStatus(jobId);

                if (statusRes.status === 'completed') {
                    setResult(statusRes.transcript);
                    setStatus('done');
                    showToast('Transcription completed successfully!', 'success');
                    return;
                } else if (statusRes.status === 'failed') {
                    throw new Error(statusRes.error || 'Transcription failed on GPU worker');
                } else if (statusRes.status === 'local_mode') {
                    // Dev mode: RunPod not configured, show placeholder result
                    setResult({
                        segments: [
                            { speaker: 'Speaker 1', start: 0, text: 'Backend connected. Configure RUNPOD_API_KEY to enable real GPU transcription.' }
                        ]
                    });
                    setStatus('done');
                    showToast('Local mode: RunPod not configured.', 'success');
                    return;
                }
                // status === 'processing' → keep polling
            }
            throw new Error('Transcription timed out after 5 minutes.');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'An error occurred during transcription.', 'error');
            setStatus('idle');
        }
    };


    const reset = () => {
        setFile(null);
        setResult(null);
        setStatus('idle');
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
                            <UploadArea file={file} setFile={setFile} onTranscribe={handleTranscribe} />
                        )}

                        {(status === 'uploading' || status === 'processing') && (
                            <ProcessingStatus status={status} />
                        )}

                        {status === 'done' && (
                            <TranscriptionResult result={result} file={file} onReset={reset} />
                        )}
                    </>
                )}

                {currentView === 'history' && <HistoryView />}

                {currentView === 'settings' && <SettingsView />}
            </main>
        </div>
    );
}
