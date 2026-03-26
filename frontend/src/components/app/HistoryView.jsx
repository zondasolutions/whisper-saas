import { motion } from 'framer-motion';

const MOCK_HISTORY = [
    { id: '1', name: 'Q3 Earnings Call.mp3', date: 'Oct 24, 2024', duration: '45:12', status: 'Completed' },
    { id: '2', name: 'Interview_John_Doe.wav', date: 'Oct 22, 2024', duration: '18:05', status: 'Completed' },
    { id: '3', name: 'Product_Sync_Weekly.m4a', date: 'Oct 20, 2024', duration: '32:41', status: 'Completed' },
    { id: '4', name: 'VoiceMemo_Idea.ogg', date: 'Oct 15, 2024', duration: '02:15', status: 'Completed' },
];

export default function HistoryView() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto pt-8"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline text-white mb-2">Transcription History</h1>
                    <p className="text-on-surface-variant">Review and manage your past transcriptions.</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="bg-surface-container border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors w-64"
                    />
                </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-surface-container-high/50">
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">File Name</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Duration</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_HISTORY.map((item) => (
                            <motion.tr
                                variants={itemVariants}
                                key={item.id}
                                className="border-b border-white/5 hover:bg-surface-container transition-colors group"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container/20 group-hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">audio_file</span>
                                        </div>
                                        <span className="text-sm font-medium text-white">{item.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-on-surface-variant">{item.date}</td>
                                <td className="py-4 px-6 text-sm text-on-surface-variant font-mono">{item.duration}</td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-colors" title="Download TXT">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                        <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-colors" title="Copy Text">
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                        <button className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {MOCK_HISTORY.length === 0 && (
                    <div className="p-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">history</span>
                        <p className="text-sm">No transcriptions found in history.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
