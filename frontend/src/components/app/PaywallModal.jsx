import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PaywallModal({ isOpen, onClose }) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const features = [
        t('paywall.f1'),
        t('paywall.f2'),
        t('paywall.f3'),
        t('paywall.f4'),
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card relative z-10 w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl bg-surface-container-high/90 overflow-hidden"
                >
                    {/* Decorative glow */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-container/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <span className="material-symbols-outlined text-3xl">bolt</span>
                        </div>
                        <h2 className="text-2xl font-bold font-headline text-white mb-2">{t('paywall.title')}</h2>
                        <p className="text-on-surface-variant text-sm">
                            {t('paywall.subtitle')}
                        </p>
                    </div>

                    <div className="bg-surface-container rounded-2xl p-6 border border-white/5 mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white">{t('paywall.planName')}</h3>
                                <p className="text-xs text-secondary font-medium">{t('paywall.planTarget')}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">{t('paywall.price')}</span>
                                <span className="text-xs text-on-surface-variant">{t('paywall.perMonth')}</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6 relative z-10">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors relative z-10 shadow-lg shadow-primary/20">
                            {t('paywall.upgradeBtn')}
                        </button>
                    </div>

                    <p className="text-xs text-center text-on-surface-variant">
                        {t('paywall.paymentNote')}
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
