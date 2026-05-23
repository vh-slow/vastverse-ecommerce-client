'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { apiProduct } from '@/src/services';

export default function Header() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('query');

    const [searchQuery, setSearchQuery] = useState('');

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchFormRef = useRef<HTMLDivElement>(null);
    const skipFetchRef = useRef(false);

    const { user, isLoading } = useAuth();

    useEffect(() => {
        setMounted(true);
        const headerMain = document.querySelector(
            '.header-main'
        ) as HTMLElement;
        const appWrap = document.querySelector('.app-wrap') as HTMLElement;

        if (headerMain && appWrap) {
            const initialHeaderHeight = headerMain.offsetHeight;
            const originalBodyPadding = initialHeaderHeight;
            const scrolledBodyPadding = originalBodyPadding - 10;

            appWrap.style.paddingTop = `${originalBodyPadding}px`;

            const handleScroll = () => {
                if (window.scrollY > 50) {
                    setIsScrolled(true);
                    appWrap.style.paddingTop = `${scrolledBodyPadding}px`;
                } else {
                    setIsScrolled(false);
                    appWrap.style.paddingTop = `${originalBodyPadding}px`;
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        if (!queryFromUrl) setSearchQuery('');
        else setSearchQuery(queryFromUrl);
    }, [queryFromUrl]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchFormRef.current &&
                !searchFormRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.trim().length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (skipFetchRef.current) {
            skipFetchRef.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const data = await apiProduct.getSearchSuggestions(
                    searchQuery.trim(),
                    5
                );
                console.log('cs: ', data);
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            }
        }, 100);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (!searchQuery.trim()) {
            router.push(`/products`);
        } else {
            router.push(
                `/products?query=${encodeURIComponent(searchQuery.trim())}`
            );
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        skipFetchRef.current = true;
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        router.push(`/products?query=${encodeURIComponent(suggestion)}`);
    };

    if (!mounted) {
        return <header className="header-main h-[133px] bg-white"></header>;
    }

    return (
        <header className="header-main">
            <div className="container header-container">
                {/* Logo */}
                <a href="/" className="logo">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="logo-img"
                    />
                    <h1 className="logo-text">VastVerse</h1>
                </a>

                {/* Search */}
                <div
                    className="relative flex-1 w-full max-w-lg mx-auto"
                    ref={searchFormRef}
                >
                    <form
                        className="flex items-center w-full bg-white border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="text"
                            placeholder={t('shop.header.search_placeholder')}
                            className="w-full px-5 py-2.5 text-sm text-gray-700 bg-transparent outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (suggestions.length > 0)
                                    setShowSuggestions(true);
                            }}
                        />
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-gray-100 z-[9999] overflow-hidden">
                            <ul className="py-2">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                            className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                                        >
                                            <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs"></i>
                                            <span className="font-medium flex-1 truncate">
                                                {suggestion}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="header-actions">
                    {/* Language */}
                    <div className="header-action language-action pr-4 border-r border-gray-200">
                        <Suspense fallback={<div>...</div>}>
                            <LanguageSwitcher />
                        </Suspense>
                    </div>

                    {/* Account */}
                    <div className="header-action pl-2">
                        <Link href={user ? '/account' : '/login'}>
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="currentColor"
                                className="icon fill-blue"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.9995 1.14581C8.59473 1.14581 6.64531 3.09524 6.64531 5.49998C6.64531 7.90472 8.59473 9.85415 10.9995 9.85415C13.4042 9.85415 15.3536 7.90472 15.3536 5.49998C15.3536 3.09524 13.4042 1.14581 10.9995 1.14581ZM8.02031 5.49998C8.02031 3.85463 9.35412 2.52081 10.9995 2.52081C12.6448 2.52081 13.9786 3.85463 13.9786 5.49998C13.9786 7.14533 12.6448 8.47915 10.9995 8.47915C9.35412 8.47915 8.02031 7.14533 8.02031 5.49998Z"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.9995 11.2291C8.87872 11.2291 6.92482 11.7112 5.47697 12.5256C4.05066 13.3279 2.97864 14.5439 2.97864 16.0416L2.97858 16.1351C2.97754 17.2001 2.97624 18.5368 4.14868 19.4916C4.7257 19.9614 5.53291 20.2956 6.6235 20.5163C7.71713 20.7377 9.14251 20.8541 10.9995 20.8541C12.8564 20.8541 14.2818 20.7377 15.3754 20.5163C16.466 20.2956 17.2732 19.9614 17.8503 19.4916C19.0227 18.5368 19.0214 17.2001 19.0204 16.1351L19.0203 16.0416C19.0203 14.5439 17.9483 13.3279 16.522 12.5256C15.0741 11.7112 13.1202 11.2291 10.9995 11.2291ZM4.35364 16.0416C4.35364 15.2612 4.92324 14.4147 6.15108 13.724C7.35737 13.0455 9.07014 12.6041 10.9995 12.6041C12.9288 12.6041 14.6416 13.0455 15.8479 13.724C17.0757 14.4147 17.6453 15.2612 17.6453 16.0416C17.6453 17.2405 17.6084 17.9153 16.982 18.4254C16.6424 18.702 16.0746 18.9719 15.1027 19.1686C14.1338 19.3648 12.8092 19.4791 10.9995 19.4791C9.18977 19.4791 7.86515 19.3648 6.89628 19.1686C5.92437 18.9719 5.35658 18.702 5.01693 18.4254C4.39059 17.9153 4.35364 17.2405 4.35364 16.0416Z"
                                ></path>
                            </svg>
                            <div className="action-text account-text">
                                <span className="label">
                                    {t('shop.header.account_label')}
                                </span>
                                <span className="value">
                                    {isLoading
                                        ? t('shop.header.account_loading')
                                        : user
                                          ? user.name // Đổi từ firstName/lastName thành name
                                          : t('shop.header.account_signin')}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Cart */}
                    <div className="header-action cart-action">
                        <Link href="/cart">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="icon fill-blue"
                            >
                                <path
                                    d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z"
                                    fill="#3c50e0"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z"
                                    fill="#3c50e0"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.2502 19.5C5.2502 20.7426 6.25756 21.75 7.5002 21.75C8.74285 21.75 9.7502 20.7426 9.7502 19.5C9.7502 18.2573 8.74285 17.25 7.5002 17.25C6.25756 17.25 5.2502 18.2573 5.2502 19.5ZM7.5002 20.25C7.08599 20.25 6.7502 19.9142 6.7502 19.5C6.7502 19.0857 7.08599 18.75 7.5002 18.75C7.91442 18.75 8.2502 19.0857 8.2502 19.5C8.2502 19.9142 7.91442 20.25 7.5002 20.25Z"
                                    fill="#3c50e0"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.25 19.5001C14.25 20.7427 15.2574 21.7501 16.5 21.7501C17.7426 21.7501 18.75 20.7427 18.75 19.5001C18.75 18.2574 17.7426 17.2501 16.5 17.2501C15.2574 17.2501 14.25 18.2574 14.25 19.5001ZM16.5 20.2501C16.0858 20.2501 15.75 19.9143 15.75 19.5001C15.75 19.0859 16.0858 18.7501 16.5 18.7501C16.9142 18.7501 17.25 19.0859 17.25 19.5001C17.25 19.9143 16.9142 20.2501 16.5 20.2501Z"
                                    fill="#3c50e0"
                                ></path>
                            </svg>
                            <span className="cart-badge">0</span>
                            <div className="action-text cart-text">
                                <span className="label">
                                    {t('shop.header.cart_label')}
                                </span>
                                <span className="value">0</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav
                className={`header-nav border-t border-gray-200 ${isScrolled ? 'header-nav-scrolled' : ''}`}
            >
                <div className="container nav-container">
                    <ul className="nav-list">
                        <li>
                            <Link href="/home" className="nav-link">
                                {t('shop.header.nav.shop')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="nav-link">
                                {t('shop.header.nav.about')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className="nav-link">
                                {t('shop.header.nav.products')}
                            </Link>
                        </li>
                    </ul>

                    <ul className="nav-list">
                        <li>
                            <Link href="#new-arrivals" className="nav-link">
                                {t('shop.header.nav.new_arrivals')}
                            </Link>
                        </li>
                        <li>
                            <Link href="#on-sellers" className="nav-link">
                                {t('shop.header.nav.on_sellers')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
