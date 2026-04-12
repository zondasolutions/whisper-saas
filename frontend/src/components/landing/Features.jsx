import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FEATURE_CARDS = [
    {
        icon: 'psychology',
        color: 'text-primary',
        hoverBorder: 'hover:border-primary/30',
        titleKey: 'features.card1Title',
        descKey: 'features.card1Desc',
        ctaKey: 'features.card1Cta',
        link: '/about',
    },
    {
        icon: 'groups',
        color: 'text-secondary',
        hoverBorder: 'hover:border-secondary/30',
        titleKey: 'features.card2Title',
        descKey: 'features.card2Desc',
        ctaKey: 'features.card2Cta',
        link: '/app',
    },
    {
        icon: 'enhanced_encryption',
        color: 'text-primary-fixed-dim',
        hoverBorder: 'hover:border-primary-fixed-dim/30',
        titleKey: 'features.card3Title',
        descKey: 'features.card3Desc',
        ctaKey: 'features.card3Cta',
        link: '/contact',
    },
];

export default function Features() {
    const { t } = useTranslation();

    return (
        <section id="features" className="py-32 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline text-white mb-6">
                            {t('features.heading')}{' '}
                            <span className="italic text-primary">{t('features.headingItalic')}</span>
                        </h2>
                        <p className="text-on-surface-variant text-lg">
                            {t('features.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {FEATURE_CARDS.map((f) => (
                        <div key={f.titleKey} className={`glass-card p-10 rounded-3xl border border-white/5 ${f.hoverBorder} transition-all group`}>
                            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className={`material-symbols-outlined ${f.color} text-3xl`}>{f.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{t(f.titleKey)}</h3>
                            <p className="text-on-surface-variant leading-relaxed mb-6">{t(f.descKey)}</p>
                            <Link to={f.link} className={`inline-flex items-center gap-2 ${f.color} text-sm font-bold hover:opacity-80 transition-opacity`}>
                                {t(f.ctaKey)} <span className="material-symbols-outlined text-sm">trending_flat</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
