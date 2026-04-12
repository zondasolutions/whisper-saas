import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function HistoryView({ onViewResult }) {
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        try {
            if (user?.id) {
                const historyKey = `whisper_history_v1_${user.id}`;
                const data = JSON.parse(localStorage.getItem(historyKey) || '[]');
                setHistory(data);
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    }, [user?.id]);

    const handleDelete = (id) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        if (user?.id) {
            const historyKey = `whisper_history_v1_${user.id}`;
            localStorage.setItem(historyKey, JSON.stringify(updated));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const filteredHistory = history.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto pt-8"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline text-white mb-2">{t('history.title')}</h1>
                    <p className="text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        {t('history.subtitle')}
                    </p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('history.searchPlaceholder')}
                        className="bg-surface-container border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors w-64"
                    />
                </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-surface-container-high/50">
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('history.fileName')}</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('history.date')}</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('history.duration')}</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('history.status')}</th>
                            <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('history.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((item) => (
                            <motion.tr
                                variants={itemVariants}
                                key={item.id}
                                className="border-b border-white/5 hover:bg-surface-container transition-colors group cursor-pointer"
                                onClick={() => onViewResult && onViewResult(item)}
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container/20 group-hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">description</span>
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
                                <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onViewResult && onViewResult(item)}
                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-colors"
                                            title="View Transcript"
                                        >
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {history.length === 0 && (
                    <div className="p-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">history</span>
                        <p className="text-sm">{t('history.noHistory')}</p>
                        <p className="text-xs mt-1">{t('history.noHistoryHint')}</p>
                    </div>
                )}
                {history.length > 0 && filteredHistory.length === 0 && (
                    <div className="p-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">search_off</span>
                        <p className="text-sm">{t('history.noResults')}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
