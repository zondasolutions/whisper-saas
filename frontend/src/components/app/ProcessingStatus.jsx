export default function ProcessingStatus({ status }) {
    const isUploading = status === 'uploading';

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 text-center">
            <div className="relative w-20 h-20">
                <div className={`absolute inset-0 rounded-full border-4 ${isUploading ? 'border-primary-container/20' : 'border-secondary-container/20'}`} />
                <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin ${isUploading ? 'border-t-primary-container' : 'border-t-secondary-container'}`} />
                <div className={`absolute inset-3 rounded-full flex items-center justify-center ${isUploading ? 'bg-primary-container/10' : 'bg-secondary-container/10'}`}>
                    <span className={`material-symbols-outlined text-2xl ${isUploading ? 'text-primary' : 'text-secondary'}`}>
                        {isUploading ? 'cloud_upload' : 'psychology'}
                    </span>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {isUploading ? 'Encrypting & Uploading…' : 'AI is Transcribing on GPU…'}
                </h2>
                <p className="text-on-surface-variant">
                    {isUploading
                        ? 'Establishing zero-trust connection to secure storage'
                        : 'Whisper Large-v3 Model · Speaker Diarization active'}
                </p>
            </div>
        </div>
    );
}
