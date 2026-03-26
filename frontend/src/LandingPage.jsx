export default function LandingPage({ onStart }) {
  return (
    <div className="font-body text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="sonic-orb bg-primary-container w-[500px] h-[500px] -top-48 -left-24" />
        <div className="sonic-orb bg-secondary-container w-[400px] h-[400px] top-1/2 -right-24" />
        <div className="sonic-orb bg-primary w-[300px] h-[300px] bottom-0 left-1/4" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#121317]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="text-2xl font-bold tracking-tighter text-white font-headline">Voxify</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">About</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Login
            </button>
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-80 transition-all duration-300 scale-95 active:scale-90"
              style={{ boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
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
                <button onClick={onStart} className="btn-primary">
                  Start Transcribing
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
                <button className="btn-ghost">Watch Demo</button>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card rounded-2xl p-4 border border-outline-variant/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_j9Wpt-YcGt2xJwWo81ckQErPfJshhBAbthigRwced1_zSasut3f2tEDGx0PW01pcASpwLHLeSzNABAa5dDuzWQiTiICqxBiJWdeQR-WaTvXp4V_pfv5MPiHky-dUY7V7W6nujg5ciSIGLarPiiG57cXoMYU9uwYAru-NTA3vMV9EQ-nHvJjTPg6rU8mEeC0ZNpGhmV6VZLiMlMDmUc_So_HGihnqYpeB3hch-lWErqQ7WAq4APvsa9gJdPAYh1V_7QAfc71zFOY"
                  alt="Audio Studio"
                  className="rounded-xl w-full h-[400px] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl" />
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

        {/* Stats */}
        <section className="py-12 border-y border-white/5 bg-surface-container-lowest/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-1">
                <div className="text-4xl font-bold font-headline text-white tracking-tighter">500M+</div>
                <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Minutes Transcribed</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold font-headline text-secondary tracking-tighter">99.2%</div>
                <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Accuracy Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold font-headline text-white tracking-tighter">&lt; 30s</div>
                <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Turnaround Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
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
                },
                {
                  icon: 'groups',
                  color: 'text-secondary',
                  hoverBorder: 'hover:border-secondary/30',
                  title: 'Speaker Diarization',
                  desc: 'Automatically detect and label individual speakers in any conversation, perfect for podcasts and board meetings.',
                  cta: 'VIEW SAMPLES',
                },
                {
                  icon: 'enhanced_encryption',
                  color: 'text-primary-fixed-dim',
                  hoverBorder: 'hover:border-primary-fixed-dim/30',
                  title: 'Ephemeral Processing',
                  desc: 'Your data is yours alone. All files are automatically purged from our servers immediately after transcription.',
                  cta: 'SECURITY DOCS',
                },
              ].map((f) => (
                <div key={f.title} className={`glass-card p-10 rounded-3xl border border-white/5 ${f.hoverBorder} transition-all group`}>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <span className={`material-symbols-outlined ${f.color} text-3xl`}>{f.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-6">{f.desc}</p>
                  <div className={`flex items-center gap-2 ${f.color} text-sm font-bold`}>
                    {f.cta} <span className="material-symbols-outlined text-sm">trending_flat</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
            <div className="sonic-orb bg-primary w-64 h-64 -top-32 -left-32 opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-white mb-8">
                Ready to transform your sound?
              </h2>
              <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">
                Join 10,000+ creators and enterprises who trust Voxify for their critical transcription needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={onStart} className="bg-white text-background px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all">
                  Get Started Free
                </button>
                <button className="bg-surface-container-high text-white px-10 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-surface-container-highest transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#121317] border-t border-white/5 py-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6">
              <div className="text-2xl font-black text-primary-container font-headline">Voxify</div>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                Transmuting sound into clarity. The world's fastest AI transcription engine for high-stakes professionals.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              {[
                { title: 'Platform', links: ['Features', 'API Docs', 'Integrations'] },
                { title: 'Company',  links: ['About Us', 'Careers', 'Status'] },
                { title: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Security'] },
              ].map((col) => (
                <div key={col.title} className="space-y-4">
                  <h4 className="text-white font-bold text-sm tracking-widest uppercase">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}><a href="#" className="text-gray-500 hover:text-primary-container transition-colors text-sm">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm tracking-wide">© 2024 Voxify AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.011-1.04-.017-2.043-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.188.69.8.574C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
