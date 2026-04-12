import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Orb from '../common/Orb';

export default function CtaBanner() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section className="py-24 px-8">
            <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
                <Orb className="bg-primary w-64 h-64 -top-32 -left-32 opacity-10 absolute pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-white mb-8">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">
                        {t('cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button onClick={() => navigate('/app')} className="bg-white text-background px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all">
                            {t('cta.startFree')}
                        </button>
                        <button onClick={() => navigate('/contact')} className="bg-surface-container-high text-white px-10 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-surface-container-highest transition-all">
                            {t('cta.contactSales')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
