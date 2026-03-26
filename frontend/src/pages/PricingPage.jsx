import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Orb from '../components/common/Orb';

export default function PricingPage() {
    return (
        <div className="font-body text-on-background min-h-screen flex flex-col">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <Orb className="bg-primary-container w-[500px] h-[500px] -top-48 -left-24 absolute" />
                <Orb className="bg-secondary-container w-[400px] h-[400px] top-1/2 -right-24 absolute" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1 pt-40 pb-24 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold font-headline leading-tight text-white mb-6">
                        Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">pricing</span>
                    </h1>
                    <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-16">
                        Start for free, upgrade when you need to process large files.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        <div className="glass-card rounded-3xl p-10 border border-white/5 hover:border-primary/30 transition-all">
                            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                            <div className="text-4xl font-headline font-bold text-primary mb-6">$0<span className="text-lg text-on-surface-variant">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">check_circle</span> 5 mins per audio</li>
                                <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">check_circle</span> Standard Diarization</li>
                            </ul>
                            <button className="w-full bg-surface-container-high py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-colors">Current Plan</button>
                        </div>

                        <div className="glass-card rounded-3xl p-10 border border-secondary/30 relative overflow-hidden shadow-[0_0_40px_rgba(70,234,229,0.1)]">
                            <div className="absolute top-0 right-0 bg-secondary text-background text-xs font-bold px-4 py-1 rounded-bl-xl tracking-widest">PRO</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                            <div className="text-4xl font-headline font-bold text-secondary mb-6">$29<span className="text-lg text-on-surface-variant">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Unlimited audio length</li>
                                <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Advanced Diarization</li>
                                <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Priority GPU Queue</li>
                            </ul>
                            <button className="w-full bg-secondary text-background py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">Upgrade Now</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
