import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ className = '' }) {
    const { i18n } = useTranslation();
    const isEs = i18n.language === 'es';

    const toggle = () => {
        const newLang = isEs ? 'en' : 'es';
        localStorage.setItem('voxify_lang', newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggle}
            title={isEs ? 'Switch to English' : 'Cambiar a Español'}
            className={`flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-surface-container border border-white/5 ${className}`}
        >
            <span className="material-symbols-outlined text-sm">language</span>
            <span className={isEs ? 'text-white' : 'opacity-40'}>ES</span>
            <span className="opacity-20">|</span>
            <span className={!isEs ? 'text-white' : 'opacity-40'}>EN</span>
        </button>
    );
}
