import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Hero() {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(true);

    return (
        <section className="pt-40 pb-24 px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
                        <span className="w-2 h-2 rounded-full bg-secondary" style={{ boxShadow: '0 0 8px #46eae5' }} />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">v3.0 Engine Live</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold font-headline leading-[1.1] tracking-tight text-white">
                        Transcribe Audio at the{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Speed of Thought
                        </span>
                    </h1>
                    <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
                        Enterprise-grade AI transcription with speaker diarization. 100% ephemeral. Impossibly fast.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button onClick={() => navigate('/app')} className="btn-primary">
                            Start Transcribing
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                        <button className="btn-ghost">Watch Demo</button>
                    </div>
                </div>

                <div className="relative">
                    <div className="glass-card rounded-2xl p-4 border border-outline-variant/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <video
                            src="/Voxify_AI_SaaS_Product_Trailer.mp4"
                            autoPlay
                            loop
                            playsInline
                            muted={isMuted}
                            className="rounded-xl w-full h-[400px] object-cover opacity-90"
                        />
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute top-8 right-8 bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 p-2.5 rounded-full text-white transition-all z-20 hover:scale-110 flex items-center justify-center shadow-lg"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {isMuted ? 'volume_off' : 'volume_up'}
                            </span>
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl pointer-events-none" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                                </div>
                                <div className="flex-1">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-secondary rounded-full" />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-gray-400 font-mono">PROCESSING WAVEFORM...</span>
                                        <span className="text-[10px] text-secondary font-mono">98% ACCURACY</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
