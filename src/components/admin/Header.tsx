'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface Breadcrumb {
    name: string;
    href?: string;
}

interface AdminHeader {
    title: string;
    breadcrumbs: Breadcrumb[];
}

const DateFilterDropdown = () => {
    const { t } = useTranslation('admin');
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTimeRange = searchParams.get('timeRange') || 'this_month';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (range: string) => {
        if (range === 'custom') {
            setIsCustomModalOpen(true);
            setIsOpen(false);
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set('timeRange', range);
            params.delete('fromDate');
            params.delete('toDate');
            router.push(`${pathname}?${params.toString()}`);
            setIsOpen(false);
        }
    };

    const handleCustomApply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const from = formData.get('fromDate') as string;
        const to = formData.get('toDate') as string;

        const params = new URLSearchParams(searchParams.toString());
        params.set('timeRange', 'custom');
        if (from) params.set('fromDate', from);
        if (to) params.set('toDate', to);

        router.push(`${pathname}?${params.toString()}`);
        setIsCustomModalOpen(false);
    };

    const filterOptions = [
        { id: 'today', label: t('header.date_options.today') },
        { id: 'last_7_days', label: t('header.date_options.last_7_days') },
        { id: 'last_30_days', label: t('header.date_options.last_30_days') },
        { id: 'this_month', label: t('header.date_options.this_month') },
        { id: 'this_year', label: t('header.date_options.this_year') },
        { id: 'all_time', label: t('header.date_options.all_time') },
        { id: 'custom', label: t('header.date_options.custom') },
    ];

    const currentLabel =
        filterOptions.find((o) => o.id === currentTimeRange)?.label ||
        t('header.date_filter');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${currentTimeRange !== 'this_month' && currentTimeRange !== 'all_time' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
                <span className="max-w-[120px] truncate">{currentLabel}</span>
                <i
                    className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                ></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden origin-top-right animate-fade-in-up">
                    <ul className="py-1.5">
                        {filterOptions.map((opt) => (
                            <li key={opt.id}>
                                <button
                                    onClick={() => handleSelect(opt.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentTimeRange === opt.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isCustomModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {t('header.custom_date.title')}
                            </h3>
                            <button
                                onClick={() => setIsCustomModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCustomApply}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('header.custom_date.from')}
                                    </label>
                                    <input
                                        type="date"
                                        name="fromDate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('header.custom_date.to')}
                                    </label>
                                    <input
                                        type="date"
                                        name="toDate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCustomModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {t('header.custom_date.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    {t('header.custom_date.apply')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
// ----------------------------------------------------------------------

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

                <Suspense
                    fallback={
                        <div className="w-32 h-9 bg-gray-100 rounded-lg animate-pulse"></div>
                    }
                >
                    <DateFilterDropdown />
                </Suspense>
            </div>
        </header>
    );
}
