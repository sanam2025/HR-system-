/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import ar from './ar';
import en from './en';

type Lang = 'ar' | 'en';
type T = typeof ar;

const translations: Record<Lang, T> = { ar, en };

type LanguageContextType = {
    lang: Lang;
    t: T;
    isRTL: boolean;
    dir: 'rtl' | 'ltr';
    toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

import i18next from '../index'; // import i18n instance

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => {
        const stored = localStorage.getItem('lang');
        return (stored === 'en' ? 'en' : 'ar');
    });

    useEffect(() => {        if (i18next.language !== lang) {
            i18next.changeLanguage(lang);
        }
    }, []);

    const t = translations[lang] || translations.ar;
    const isRTL = lang === 'ar';
    const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr';

    const toggleLang = () => {
        const next: Lang = lang === 'ar' ? 'en' : 'ar';
        setLang(next);
        localStorage.setItem('lang', next);
        i18next.changeLanguage(next);
    };    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        document.body.style.fontFamily = isRTL
            ? "'Tajawal', 'Inter', sans-serif"
            : "'Inter', 'Tajawal', sans-serif";
    }, [lang, dir, isRTL]);

    return (
        <LanguageContext.Provider value={{ lang, t, isRTL, dir, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
}
