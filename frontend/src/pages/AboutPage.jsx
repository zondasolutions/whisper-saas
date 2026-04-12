import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Orb from '../components/common/Orb';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const values = [
        { titleKey: 'about.v1Title', icon: 'security', descKey: 'about.v1Desc' },
        { titleKey: 'about.v2Title', icon: 'speed', descKey: 'about.v2Desc' },
        { titleKey: 'about.v3Title', icon: 'record_voice_over', descKey: 'about.v3Desc' },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="font-body text-on-background min-h-screen flex flex-col"
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <Orb className="bg-primary-container w-[600px] h-[600px] -top-32 -left-32 absolute opacity-40 mix-blend-screen" />
                <Orb className="bg-secondary-container w-[500px] h-[500px] top-1/2 -right-32 absolute opacity-20 mix-blend-screen" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1 pt-40 pb-24 px-8">
                <div className="max-w-6xl mx-auto">

                    <motion.div variants={itemVariants} className="text-center mb-24">
                        <h1 className="text-6xl md:text-7xl font-extrabold font-headline leading-tight text-white mb-8 tracking-tight">
                            {t('about.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('about.title2')}</span>
                        </h1>
                        <p className="text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                            {t('about.subtitle')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-4xl font-bold font-headline text-white">{t('about.genesisTitle')}</h2>
                            <p className="text-lg text-on-surface-variant leading-relaxed">
                                {t('about.genesisPara1')}
                            </p>
                            <p className="text-lg text-on-surface-variant leading-relaxed">
                                {t('about.genesisPara2')}
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative glass-card rounded-3xl p-8 border border-white/10 h-full flex flex-col justify-center overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                    alt="Data visualization"
                                    className="rounded-2xl opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 object-cover h-64 w-full"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-24">
                        {values.map((val) => (
                            <div key={val.titleKey} className="glass-card rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all hover:-translate-y-2 duration-300">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 block">{val.icon}</span>
                                <h3 className="text-2xl font-bold text-white mb-4">{t(val.titleKey)}</h3>
                                <p className="text-on-surface-variant leading-relaxed">{t(val.descKey)}</p>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
