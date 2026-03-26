import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LandingPage from '../pages/LandingPage';
import AppView from '../pages/AppView';
import PricingPage from '../pages/PricingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import AuthPage from '../pages/AuthPage';
import FeaturesPage from '../pages/FeaturesPage';

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<AppView />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </AnimatePresence>
    );
}
