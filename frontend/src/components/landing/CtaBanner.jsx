import { useNavigate } from 'react-router-dom';
import Orb from '../common/Orb';

export default function CtaBanner() {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-8">
            <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
                <Orb className="bg-primary w-64 h-64 -top-32 -left-32 opacity-10 absolute pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-white mb-8">
                        Ready to transform your sound?
                    </h2>
                    <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">
                        Join 10,000+ creators and enterprises who trust Voxify for their critical transcription needs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button onClick={() => navigate('/app')} className="bg-white text-background px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all">
                            Get Started Free
                        </button>
                        <button onClick={() => navigate('/contact')} className="bg-surface-container-high text-white px-10 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-surface-container-highest transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
