import { useState } from 'react';
import { motion } from 'framer-motion';
import PaywallModal from './PaywallModal';
import { useTranslation } from 'react-i18next';

export default function SettingsView() {
    const [showPaywall, setShowPaywall] = useState(false);
    const { t } = useTranslation();

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
            className="max-w-4xl mx-auto pt-8"
        >
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-white mb-2">{t('settings.title')}</h1>
                <p className="text-on-surface-variant">{t('settings.subtitle')}</p>
            </div>

            <div className="space-y-6">

                {/* Subscription Card */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{t('settings.currentPlan')}</h3>
                            <p className="text-on-surface-variant text-sm">{t('settings.usageInfo')}</p>
                        </div>
                        <button
                            onClick={() => setShowPaywall(true)}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                        >
                            {t('settings.viewPremium')}
                        </button>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">{t('settings.profileTitle')}</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background text-3xl font-bold">
                            JD
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('settings.fullName')}</label>
                                    <input type="text" defaultValue="John Doe" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('settings.emailAddress')}</label>
                                    <input type="email" defaultValue="demo@voxify.ai" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" disabled />
                                </div>
                            </div>
                            <button className="bg-surface-container-high text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-surface-container-highest transition-colors">
                                {t('settings.saveChanges')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">{t('settings.preferencesTitle')}</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">{t('settings.defaultLanguage')}</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">{t('settings.defaultLanguageHint')}</p>
                            </div>
                            <select className="bg-surface-container border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-primary/50 w-48 appearance-none cursor-pointer">
                                <option value="auto">{t('settings.autoDetect')}</option>
                                <option value="en">{t('settings.english')}</option>
                                <option value="es">{t('settings.spanish')}</option>
                                <option value="fr">{t('settings.french')}</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">{t('settings.diarization')}</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">{t('settings.diarizationHint')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">{t('settings.emailNotifs')}</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">{t('settings.emailNotifsHint')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-error/20 bg-error/5">
                    <h3 className="text-lg font-bold text-error mb-4 border-b border-error/20 pb-4">{t('settings.dangerZone')}</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium text-sm">{t('settings.deleteAccount')}</h4>
                            <p className="text-on-surface-variant text-xs mt-0.5">{t('settings.deleteAccountHint')}</p>
                        </div>
                        <button className="bg-error-container/20 text-error px-6 py-2 rounded-xl text-sm font-bold hover:bg-error-container/40 transition-colors border border-error/50">
                            {t('settings.deleteAccount')}
                        </button>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
