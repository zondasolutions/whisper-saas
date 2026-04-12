import { useState } from 'react';
import { motion } from 'framer-motion';
import PaywallModal from './PaywallModal';

export default function SettingsView() {
    const [showPaywall, setShowPaywall] = useState(false);

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
                <h1 className="text-3xl font-bold font-headline text-white mb-2">Settings</h1>
                <p className="text-on-surface-variant">Manage your account preferences and API integrations.</p>
            </div>

            <div className="space-y-6">

                {/* Subscription Card */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Plan Actual: Free (Demo)</h3>
                            <p className="text-on-surface-variant text-sm">Has usado 30 min de tu cuota mensual.</p>
                        </div>
                        <button 
                            onClick={() => setShowPaywall(true)}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                        >
                            Ver Planes Premium
                        </button>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Profile Information</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background text-3xl font-bold">
                            JD
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Full Name</label>
                                    <input type="text" defaultValue="John Doe" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Email Address</label>
                                    <input type="email" defaultValue="demo@voxify.ai" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" disabled />
                                </div>
                            </div>
                            <button className="bg-surface-container-high text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-surface-container-highest transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Transcription Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">Default Language</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">Force a specific language or leave auto-detect.</p>
                            </div>
                            <select className="bg-surface-container border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-primary/50 w-48 appearance-none cursor-pointer">
                                <option value="auto">Auto-Detect</option>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">Speaker Diarization</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">Identify different speakers in the audio automatically.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium text-sm">Email Notifications</h4>
                                <p className="text-on-surface-variant text-xs mt-0.5">Receive an email when long transcriptions complete.</p>
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
                    <h3 className="text-lg font-bold text-error mb-4 border-b border-error/20 pb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium text-sm">Delete Account</h4>
                            <p className="text-on-surface-variant text-xs mt-0.5">Permanently delete your account and all ephemerally stored data.</p>
                        </div>
                        <button className="bg-error-container/20 text-error px-6 py-2 rounded-xl text-sm font-bold hover:bg-error-container/40 transition-colors border border-error/50">
                            Delete Account
                        </button>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
