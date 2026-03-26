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
            // 1. Upload the file
            const uploadRes = await apiClient.upload(file);

            setStatus('processing');
            // 2. Transcribe using the returned file ID or path
            // Note: adjust the 'uploadRes.file_id' or similar depending on the exact backend response structure.
            const fileId = uploadRes.file_id || uploadRes.filename || 'default_id';
            const transcribeRes = await apiClient.transcribe(fileId);

            setResult(transcribeRes);
            setStatus('done');
            showToast('Transcription completed successfully!', 'success');
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
