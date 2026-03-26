import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Orb from '../components/common/Orb';
import Features from '../components/landing/Features';

export default function FeaturesPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-body text-on-background min-h-screen flex flex-col"
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <Orb className="bg-primary-container w-[500px] h-[500px] -top-48 -left-24 absolute opacity-50" />
                <Orb className="bg-secondary-container w-[600px] h-[600px] bottom-0 -right-24 absolute opacity-30" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1 pt-24 pb-12">
                <div className="max-w-7xl mx-auto text-center px-8 mb-[-3rem]">
                    <h1 className="text-5xl md:text-6xl font-extrabold font-headline leading-tight text-white mt-12 mb-6">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Capabilities</span>
                    </h1>
                    <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
                        Dive deep into the technology powering the world's fastest speech-to-text service.
                    </p>
                </div>

                {/* We reuse the Features component from the landing page. We wrap it in a div to preserve its internal padding/margins effectively */}
                <div className="mt-8">
                    <Features />
                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
