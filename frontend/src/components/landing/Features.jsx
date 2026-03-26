import { Link } from 'react-router-dom';

export default function Features() {
    return (
        <section id="features" className="py-32 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline text-white mb-6">
                            Built for the next generation of{' '}
                            <span className="italic text-primary">audio intelligence.</span>
                        </h2>
                        <p className="text-on-surface-variant text-lg">
                            Harness the power of state-of-the-art neural networks to decode every syllable with surgical precision.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: 'psychology',
                            color: 'text-primary',
                            hoverBorder: 'hover:border-primary/30',
                            title: 'Whisper Large-v3 Model',
                            desc: "Leveraging OpenAI's latest architecture for unparalleled multi-language support and background noise cancellation.",
                            cta: 'EXPLORE ENGINE',
                            link: '/about'
                        },
                        {
                            icon: 'groups',
                            color: 'text-secondary',
                            hoverBorder: 'hover:border-secondary/30',
                            title: 'Speaker Diarization',
                            desc: 'Automatically detect and label individual speakers in any conversation, perfect for podcasts and board meetings.',
                            cta: 'VIEW SAMPLES',
                            link: '/app'
                        },
                        {
                            icon: 'enhanced_encryption',
                            color: 'text-primary-fixed-dim',
                            hoverBorder: 'hover:border-primary-fixed-dim/30',
                            title: 'Ephemeral Processing',
                            desc: 'Your data is yours alone. All files are automatically purged from our servers immediately after transcription.',
                            cta: 'SECURITY DOCS',
                            link: '/contact'
                        },
                    ].map((f) => (
                        <div key={f.title} className={`glass-card p-10 rounded-3xl border border-white/5 ${f.hoverBorder} transition-all group`}>
                            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className={`material-symbols-outlined ${f.color} text-3xl`}>{f.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                            <p className="text-on-surface-variant leading-relaxed mb-6">{f.desc}</p>
                            <Link to={f.link} className={`inline-flex items-center gap-2 ${f.color} text-sm font-bold hover:opacity-80 transition-opacity`}>
                                {f.cta} <span className="material-symbols-outlined text-sm">trending_flat</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
