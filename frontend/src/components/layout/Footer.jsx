import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#121317] border-t border-white/5 py-16 px-8 relative z-10 w-full mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black text-primary-container font-headline">Voxify</Link>
                        <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                            Transmuting sound into clarity. The world's fastest AI transcription engine for high-stakes professionals.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {[
                            { title: 'Platform', links: [{ label: 'Features', to: '/features' }, { label: 'API Docs', to: '/docs' }, { label: 'Integrations', to: '/integrations' }] },
                            { title: 'Company', links: [{ label: 'About Us', to: '/about' }, { label: 'Careers', to: '/careers' }, { label: 'Status', to: '/status' }] },
                            { title: 'Legal', links: [{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms of Service', to: '/terms' }, { label: 'Security', to: '/security' }] },
                        ].map((col) => (
                            <div key={col.title} className="space-y-4">
                                <h4 className="text-white font-bold text-sm tracking-widest uppercase">{col.title}</h4>
                                <ul className="space-y-2">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link to={l.to} className="text-gray-500 hover:text-primary-container transition-colors text-sm">{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm tracking-wide">
                        © 2024 Voxify AI. Desarrollado por <a href="https://zondasolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors font-semibold">ZondaSolutions</a>
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.011-1.04-.017-2.043-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.188.69.8.574C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
