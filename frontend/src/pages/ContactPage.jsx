import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Orb from '../components/common/Orb';
import { useToast } from '../components/common/Toast';

export default function ContactPage() {
    const { showToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Your message has been sent successfully. Our team will contact you shortly!', 'success');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="font-body text-on-background min-h-screen flex flex-col"
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <Orb className="bg-secondary-container w-[500px] h-[500px] top-1/4 -right-24 absolute opacity-30 mix-blend-screen" />
                <Orb className="bg-primary-container w-[400px] h-[400px] bottom-10 -left-10 absolute opacity-20 mix-blend-screen" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1 pt-40 pb-24 px-8">
                <div className="max-w-6xl mx-auto">

                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-extrabold font-headline leading-tight text-white mb-6 tracking-tight">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
                        </h1>
                        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
                            Have questions about an Enterprise plan? Need custom Whisper models? Our engineering team is ready to help.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* Contact Info Sidebar */}
                        <motion.div variants={itemVariants} className="space-y-12 lg:pr-12 lg:border-r border-white/10">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Let's talk scale.</h3>
                                <p className="text-on-surface-variant leading-relaxed">
                                    We specialize in high-throughput audio pipelines. Whether you're processing 100 hours or 100,000 hours of
                                    audio per month, Voxify can be tailored to your precise infrastructure needs.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center group-hover:bg-primary-container/20 group-hover:text-primary transition-colors flex-shrink-0">
                                        <span className="material-symbols-outlined text-xl">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Global HQ</h4>
                                        <p className="text-on-surface-variant text-sm">100 AI Avenue, Tech District<br />San Francisco, CA 94105</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center group-hover:bg-secondary-container/20 group-hover:text-secondary transition-colors flex-shrink-0">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Enterprise Sales</h4>
                                        <a href="mailto:enterprise@voxify.ai" className="text-on-surface-variant hover:text-white transition-colors text-sm">enterprise@voxify.ai</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center group-hover:bg-primary/20 group-hover:text-white transition-colors flex-shrink-0">
                                        <span className="material-symbols-outlined text-xl">support_agent</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">24/7 Support</h4>
                                        <p className="text-on-surface-variant text-sm">Available for PRO & Enterprise tiers directly via the Dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-md opacity-50"></div>
                            <form onSubmit={handleSubmit} className="relative glass-card rounded-3xl p-8 md:p-10 border border-white/10 space-y-6 bg-[#121317]/80 backdrop-blur-2xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">First Name</label>
                                        <input required type="text" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Jane" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">Last Name</label>
                                        <input required type="text" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">Work Email</label>
                                    <input required type="email" className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="jane@company.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">Message</label>
                                    <textarea required rows={5} className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none" placeholder="Tell us about your audio volume and specific needs..." />
                                </div>
                                <button type="submit" className="w-full btn-primary justify-center text-base py-4 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                                    Send Message <span className="material-symbols-outlined ml-2 text-lg">send</span>
                                </button>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
