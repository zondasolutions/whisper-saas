import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

function detectLanguage() {
    // 1. User manual override (stored in localStorage)
    const saved = localStorage.getItem('voxify_lang');
    if (saved === 'es' || saved === 'en') return saved;

    // 2. Timezone detection — Argentina → Spanish
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && tz.startsWith('America/Argentina')) return 'es';
    } catch (_) { /* ignore */ }

    // 3. Browser language fallback — es-AR → Spanish
    const lang = (navigator.language || '').toLowerCase();
    if (lang.startsWith('es-ar')) return 'es';

    // 4. Default: English
    return 'en';
}

i18n
    .use(initReactI18next)
    .init({
        lng: detectLanguage(),
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            es: { translation: es },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
