'use client';

import React, {
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import i18n from '@/src/i18n';

export const LANGUAGES = [
    {
        code: 'vi',
        name: 'Tiếng Việt',
        flag: '🇻🇳',
        icon: 'https://flagcdn.com/w20/vn.png',
    },
    {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        icon: 'https://flagcdn.com/w20/us.png',
    },
];

interface LanguageContextType {
    language: string;
    changeLanguage: (lng: 'vi' | 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<string>('vi');

    useEffect(() => {
        const storedLang = localStorage.getItem('app_language');
        if (storedLang && (storedLang === 'vi' || storedLang === 'en')) {
            i18n.changeLanguage(storedLang);
            setLanguage(storedLang);
        }
    }, []);

    const changeLanguage = (lng: 'vi' | 'en') => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
        localStorage.setItem('app_language', lng);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useAppLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context)
        throw new Error('useAppLanguage must be used within LanguageProvider');
    return context;
};
