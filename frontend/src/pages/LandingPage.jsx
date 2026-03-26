import { motion } from 'framer-motion';
import Orb from '../components/common/Orb';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import CtaBanner from '../components/landing/CtaBanner';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

export default function LandingPage() {
    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="font-body text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col"
        >
            {/* Ambient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <Orb className="bg-primary-container w-[500px] h-[500px] -top-48 -left-24" />
                <Orb className="bg-secondary-container w-[400px] h-[400px] top-1/2 -right-24" />
                <Orb className="bg-primary w-[300px] h-[300px] bottom-0 left-1/4" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1">
                <motion.div variants={pageVariants}><Hero /></motion.div>
                <motion.div variants={pageVariants}><Stats /></motion.div>
                <motion.div variants={pageVariants}><Features /></motion.div>
                <motion.div variants={pageVariants}><CtaBanner /></motion.div>
            </main>

            <Footer />
        </motion.div>
    );
}
