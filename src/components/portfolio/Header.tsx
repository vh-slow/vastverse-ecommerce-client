'use client';

import React, { useEffect } from 'react';
import { initHeader } from '@/src/utils/portfolioScripts';
import Link from 'next/link';

export default function Header() {
    useEffect(() => {
        const cleanup = initHeader();
        return cleanup;
    }, []);

    return (
        <>
            <div
                id="vv-smart-nav"
                className="fixed top-0 left-0 w-full z-50 px-8 lg:px-16 py-6 bg-transparent text-white flex justify-between items-center"
            >
                <div className="flex items-center cursor-pointer group">
                    <img
                        src="/images/logo.png"
                        alt="VastVerse Logo Icon"
                        className="w-9 h-9 object-contain transition-all duration-300 group-hover:scale-105"
                    />
                    <span className="font-bold text-2xl tracking-tight ml-2 group-hover:text-gray-200 transition-colors">
                        VastVerse
                    </span>
                </div>

                <nav className="hidden md:flex gap-10 font-medium text-sm tracking-wide ml-8">
                    <a
                        href="/"
                        className="hover:text-[#3c50e0] transition-colors"
                    >
                        Trang chủ
                    </a>
                    <a
                        href="#showcase"
                        className="hover:text-[#3c50e0] transition-colors"
                    >
                        Sản phẩm
                    </a>
                    <a
                        href="#team-section"
                        className="hover:text-[#3c50e0] transition-colors"
                    >
                        Đội ngũ
                    </a>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        id="search-trigger"
                        className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer p-1"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </button>

                    <div className="relative group cursor-pointer p-1">
                        <button className="opacity-80 hover:opacity-100 transition-opacity flex items-center">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                />
                            </svg>
                        </button>
                        <div className="absolute right-1/2 translate-x-1/2 top-full pt-4 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                            <div className="bg-white border border-gray-100 rounded-xl flex flex-col shadow-2xl p-1 text-left">
                                <a
                                    href="/login"
                                    className="px-3 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors font-medium mb-1"
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="px-3 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative group cursor-pointer">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-400/20 hover:bg-gray-500/20 rounded-full text-sm font-medium transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                />
                            </svg>
                            Tiếng Việt
                        </button>
                        <div className="absolute right-0 top-full pt-4 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50">
                            <div className="bg-white border border-gray-100 rounded-xl flex flex-col shadow-2xl p-1 text-left">
                                <a
                                    href="#vn"
                                    className="px-3 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 font-medium mb-1"
                                >
                                    <img
                                        src="https://flagcdn.com/w40/vn.png"
                                        alt="VN Flag"
                                        className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                    />
                                    Tiếng Việt
                                </a>
                                <a
                                    href="#en"
                                    className="px-3 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 font-medium"
                                >
                                    <img
                                        src="https://flagcdn.com/w40/us.png"
                                        alt="US Flag"
                                        className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                    />
                                    English
                                </a>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/home"
                        className="flex items-center gap-2 px-5 py-2 bg-[#0071e3] hover:bg-[#005bb5] text-white rounded-full text-sm font-semibold transition-colors ml-1 shadow-lg shadow-[#0071e3]/20"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                        </svg>
                        Cửa hàng
                    </Link>
                </div>
            </div>

            <div
                id="search-backdrop"
                className="fixed inset-0 bg-black/50 z-[55] opacity-0 pointer-events-none transition-opacity duration-500"
            ></div>

            <div
                id="search-overlay"
                className="fixed top-0 left-0 w-full bg-white text-black z-[60] transform -translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm"
            >
                <div className="px-8 lg:px-16 py-4 flex justify-between items-center relative">
                    <a
                        href="/"
                        className="flex items-center cursor-pointer group"
                    >
                        <img
                            src="/images/logo.png"
                            alt="VastVerse Logo"
                            className="w-9 h-9 object-contain opacity-80 transition-all duration-300 group-hover:scale-105"
                        />
                        <span className="font-bold text-2xl tracking-tight ml-2 text-black">
                            VastVerse
                        </span>
                    </a>

                    <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl flex flex-col z-10 top-1/2 -translate-y-1/2 mt-1">
                        <div className="relative flex items-center px-4">
                            <svg
                                className="w-5 h-5 text-gray-500 mr-3 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                            <input
                                type="text"
                                id="search-input"
                                placeholder="Search vastverse.vn..."
                                className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-gray-800 placeholder-gray-400 py-2"
                            />
                        </div>

                        <div
                            id="search-dropdown"
                            className="absolute top-[50px] left-0 w-full bg-white shadow-2xl rounded-b-2xl border border-gray-100 opacity-0 pointer-events-none transition-all duration-300 transform -translate-y-2"
                        >
                            <div className="p-6 flex flex-col gap-4">
                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    Recommended
                                </span>
                                <a
                                    href="#"
                                    className="text-[14px] text-gray-700 hover:text-[#3c50e0] font-medium transition-colors"
                                >
                                    Download Center
                                </a>
                                <a
                                    href="#"
                                    className="text-[14px] text-gray-700 hover:text-[#3c50e0] font-medium transition-colors"
                                >
                                    Checking Device Info
                                </a>
                                <a
                                    href="#"
                                    className="text-[14px] text-gray-700 hover:text-[#3c50e0] font-medium transition-colors"
                                >
                                    Activating Your Drone
                                </a>
                                <a
                                    href="#"
                                    className="text-[14px] text-gray-700 hover:text-[#3c50e0] font-medium transition-colors"
                                >
                                    Become a Partner
                                </a>
                                <a
                                    href="#"
                                    className="text-[14px] text-gray-700 hover:text-[#3c50e0] font-medium transition-colors"
                                >
                                    Accessories
                                </a>
                            </div>
                        </div>
                    </div>

                    <button
                        id="close-search"
                        className="p-2 text-gray-400 hover:text-black hover:rotate-90 transition-all duration-300"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
