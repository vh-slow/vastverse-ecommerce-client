'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Breadcrumb {
    name: string;
    href?: string;
}

interface AdminHeader {
    title: string;
    breadcrumbs: Breadcrumb[];
}

export default function Header({ title, breadcrumbs }: AdminHeader) {
    const { t } = useTranslation('admin');
    const [isExportOpen, setIsExportOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                exportRef.current &&
                !exportRef.current.contains(event.target as Node)
            ) {
                setIsExportOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex justify-between items-center p-6 border-gray-200 shrink-0">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">
                    {title}
                </h2>

                <nav
                    className="flex items-center text-sm text-gray-700 mt-1"
                    aria-label="Breadcrumb"
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <React.Fragment key={index}>
                                {isLast ? (
                                    <span
                                        className="font-normal text-gray-900"
                                        aria-current="page"
                                    >
                                        {item.name}
                                    </span>
                                ) : (
                                    <>
                                        <Link
                                            href={item.href || '#'}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                        <i className="fa-solid fa-chevron-right text-xs mx-2"></i>
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={exportRef}>
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors"
                    >
                        <span>{t('header.export')}</span>
                        <i
                            className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`}
                        ></i>
                    </button>

                    {isExportOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden origin-top-right animate-fade-in-up">
                            <ul className="py-1.5">
                                <li>
                                    <Link
                                        href="/admin/orders/export"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        <i className="fa-solid fa-file-excel w-5 text-green-600"></i>
                                        {t('header.export_orders')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/products/export"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        <i className="fa-solid fa-file-excel w-5 text-green-600"></i>
                                        {t('header.export_products')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/categories/export"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        <i className="fa-solid fa-file-excel w-5 text-green-600"></i>
                                        {t('header.export_categories')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/reviews/export"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        <i className="fa-solid fa-file-excel w-5 text-green-600"></i>
                                        {t('header.export_reviews')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/users/export"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsExportOpen(false)}
                                    >
                                        <i className="fa-solid fa-file-excel w-5 text-green-600"></i>
                                        {t('header.export_users')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors">
                    <span>{t('header.date_filter')}</span>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
            </div>
        </header>
    );
}
