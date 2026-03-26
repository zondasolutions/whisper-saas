import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Orb from '../components/common/Orb';
import Navbar from '../components/layout/Navbar';
import { useToast } from '../components/common/Toast';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password || (!isLogin && !name)) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (email === 'demo@voxify.ai' && password === 'admin' && isLogin) {
                showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => navigate('/app'), 1000);
            } else if (isLogin) {
                showToast('Invalid credentials. Try demo@voxify.ai / admin', 'error');
            } else {
                showToast('Account created successfully! Welcome aboard.', 'success');
                setTimeout(() => navigate('/app'), 1000);
            }
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
    };

    const fieldVariants = {
        hidden: { height: 0, opacity: 0, overflow: 'hidden' },
        visible: { height: 'auto', opacity: 1, transition: { height: { type: 'spring', stiffness: 300, damping: 25 }, opacity: { duration: 0.2, delay: 0.1 } } },
        exit: { height: 0, opacity: 0, transition: { height: { type: 'spring', stiffness: 300, damping: 25 }, opacity: { duration: 0.1 } } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="font-body text-on-background min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
            <Navbar />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <Orb className="bg-primary-container w-[700px] h-[700px] -top-32 -left-32 absolute opacity-30 mix-blend-screen" />
                <Orb className="bg-secondary-container w-[600px] h-[600px] -bottom-32 -right-32 absolute opacity-30 mix-blend-screen" />
            </div>

            <div className="relative z-10 w-full max-w-md mt-20">
                <motion.div variants={containerVariants} className="text-center mb-10">
                    <Link to="/" className="text-4xl font-black font-headline text-white tracking-tight cursor-pointer hover:text-primary transition-colors">Voxify</Link>
                    <p className="text-on-surface-variant mt-3 text-sm tracking-wide">
                        {isLogin ? 'Welcome back to your workspace' : 'Start transcribing at the speed of thought'}
                    </p>
                </motion.div>

                <motion.div variants={containerVariants} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                    <form onSubmit={handleSubmit} className="relative glass-card rounded-3xl p-10 border border-white/10 space-y-6 bg-[#121317]/90 backdrop-blur-2xl overflow-hidden">

                        <div className="flex gap-4 mb-2 border-b border-white/10 pb-4 relative">
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 text-center pb-2 font-bold transition-colors z-10 ${isLogin ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 text-center pb-2 font-bold transition-colors z-10 ${!isLogin ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}
                            >
                                Sign Up
                            </button>
                            {/* Animated underline indicator */}
                            <motion.div
                                className={`absolute bottom-0 h-0.5 ${isLogin ? 'bg-primary' : 'bg-secondary'}`}
                                initial={false}
                                animate={{ x: isLogin ? '0%' : '100%', width: '50%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        </div>

                        <div className="space-y-5">
                            <AnimatePresence initial={false}>
                                {!isLogin && (
                                    <motion.div
                                        key="name-field"
                                        variants={fieldVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest pl-1 mt-2">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-surface-container-lowest border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div layout>
                                <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-surface-container-lowest border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </motion.div>

                            <motion.div layout>
                                <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-surface-container-lowest border border-white/5 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {isLogin && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center justify-between text-xs pt-2"
                                >
                                    <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer group hover:text-white transition-colors">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer w-4 h-4 rounded border-white/20 bg-surface-container-lowest appearance-none checked:bg-primary transition-all cursor-pointer" />
                                            <span className="material-symbols-outlined absolute pointer-events-none text-white text-[12px] opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">check</span>
                                        </div>
                                        Remember me
                                    </label>
                                    <a href="#" className="text-primary hover:text-secondary transition-colors font-semibold tracking-wide">Forgot password?</a>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            layout
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full relative overflow-hidden group font-bold text-sm tracking-wide py-4 mt-4 rounded-xl transition-all duration-300 ${isLogin
                                ? 'bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container hover:shadow-[0_0_20px_rgba(108,92,231,0.4)]'
                                : 'bg-gradient-to-r from-secondary-container to-secondary text-background hover:shadow-[0_0_20px_rgba(70,234,229,0.4)]'
                                } ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="material-symbols-outlined"
                                        >
                                            progress_activity
                                        </motion.span>
                                        {isLogin ? 'Authenticating...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In Securely' : 'Create Free Account'}
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </form>
                </motion.div>

                <motion.p variants={containerVariants} className="text-center mt-8 text-on-surface-variant text-xs tracking-wide">
                    By continuing, you agree to Voxify's <br />
                    <a href="#" className="text-white hover:text-primary transition-colors border-b border-white/20 hover:border-primary pb-px">Terms of Service</a> and <a href="#" className="text-white hover:text-primary transition-colors border-b border-white/20 hover:border-primary pb-px">Privacy Policy</a>
                </motion.p>
            </div>
        </motion.div>
    );
}
