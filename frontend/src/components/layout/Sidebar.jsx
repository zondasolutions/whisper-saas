import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
    { icon: 'add_circle', label: 'New Transcription', id: 'new' },
    { icon: 'history', label: 'History', id: 'history' },
    { icon: 'settings', label: 'Settings', id: 'settings' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentView, setCurrentView }) {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();
    const [usage, setUsage] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            apiClient.getUsage()
                .then(data => setUsage(data))
                .catch(err => console.error("Could not fetch usage details", err));
        } else {
            setUsage(null);
        }
    }, [isLoggedIn, currentView]); // Refresh when navigating


    return (
        <aside
            className={`relative z-20 flex flex-col border-r border-white/5 bg-surface-container-lowest/80 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
                </div>
                {sidebarOpen && (
                    <span className="text-xl font-black font-headline text-white tracking-tight">Voxify</span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${currentView === item.id
                                ? 'bg-primary-container/20 text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl flex-shrink-0">{item.icon}</span>
                        {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Usage Widget */}
            {sidebarOpen && usage && (
                <div className="px-4 py-4 border-t border-white/5">
                    <div className="bg-surface-container/50 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{usage.tier} Plan</span>
                            <span className="text-[10px] bg-primary-container text-primary px-1.5 py-0.5 rounded font-mono">
                                {usage.limit_seconds === -1 ? '∞' : Math.floor(usage.used_seconds / 60) + ' / ' + Math.floor(usage.limit_seconds / 60) + 'm'}
                            </span>
                        </div>
                        
                        {usage.limit_seconds !== -1 && (
                            <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-2 overflow-hidden">
                                <div 
                                    className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${Math.min(100, (usage.used_seconds / usage.limit_seconds) * 100)}%` }}
                                ></div>
                            </div>
                        )}
                        
                        <p className="text-[10px] text-on-surface-variant/70 text-center">
                            Resets {new Date(usage.reset_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Back to landing + collapse toggle */}
            <div className="px-2 pb-4 space-y-1 border-t border-white/5 pt-4">
                {sidebarOpen && (

                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-xl flex-shrink-0">home</span>
                        <span>Home</span>
                    </button>
                )}
                
                {isLoggedIn && (
                    <button
                        onClick={() => { logout(); navigate('/') }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-all text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-xl flex-shrink-0">logout</span>
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                )}

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                >
                    <span className="material-symbols-outlined text-xl flex-shrink-0">
                        {sidebarOpen ? 'chevron_left' : 'chevron_right'}
                    </span>
                    {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}
