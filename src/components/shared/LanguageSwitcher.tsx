'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES, useAppLanguage } from '@/src/context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useAppLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentLang =
        LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    src={currentLang.icon}
                    alt={currentLang.name}
                    className="w-5 h-auto rounded-sm shadow-sm"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {currentLang.code.toUpperCase()}
                </span>
                <i
                    className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                ></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                    <div className="p-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => {
                                    changeLanguage(lang.code as 'vi' | 'en');
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                                    language === lang.code
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={lang.icon}
                                        alt={lang.name}
                                        className="w-5 rounded-sm"
                                    />
                                    <span>{lang.name}</span>
                                </div>
                                {language === lang.code && (
                                    <i className="fa-solid fa-check text-blue-600"></i>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
