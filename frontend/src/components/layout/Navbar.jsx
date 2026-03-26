import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#121317]/80 backdrop-blur-xl transition-all duration-300 border-b border-white/5">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-white font-headline">Voxify</Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/features" className="text-gray-400 hover:text-white transition-colors font-semibold text-sm">Features</Link>
                    <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/auth" className="hidden md:block text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
                        Login
                    </Link>
                    <button
                        onClick={() => navigate('/app')}
                        className="bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-80 transition-all duration-300 scale-95 active:scale-90"
                        style={{ boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}
