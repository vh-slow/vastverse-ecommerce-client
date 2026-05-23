'use client';

import { useAuth } from '@/src/context/AuthContext';
import { LANGUAGES, useAppLanguage } from '@/src/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const USER_IMAGE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
    'http://localhost:7296';

const SidebarDropdown = ({
    icon,
    title,
    children,
}: {
    icon: string;
    title: string;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLUListElement>(null);

    return (
        <li>
            <a
                href="#"
                className={`nav-link has-dropdown ${isOpen ? 'open' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                <i className={icon}></i>
                <span>{title}</span>
                <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul
                className="sub-menu"
                ref={contentRef}
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight}px`
                        : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.2s ease-in-out',
                }}
            >
                {children}
            </ul>
        </li>
    );
};

export default function Sidebar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { user, logout } = useAuth();
    const router = useRouter();

    const { language, changeLanguage } = useAppLanguage();
    const { t } = useTranslation('admin');

    const toggleUserMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
        if (isUserMenuOpen) setIsLangMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
                setIsLangMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        router.push('/admin/login');
    };

    const getAvatarSrc = () => {
        if (user?.avatarUrl) return `${USER_IMAGE_URL}${user.avatarUrl}`;
        const initial = user?.name?.charAt(0) || 'A'; // Chỉnh lại theo thuộc tính name của Backend
        return `https://placehold.co/48x48/3c50e0/ffffff?text=${initial.toUpperCase()}`;
    };

    return (
        <aside className="w-[270px] bg-aside text-white flex flex-col shrink-0">
            {/* Logo */}
            <div className="sidebar-logo">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 text-white no-underline"
                >
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="w-9 h-9 object-contain"
                    />
                    <h1 className="text-xl font-semibold">VastVerse</h1>
                </Link>
            </div>

            {/* Quick Actions (Giữ nguyên cấu trúc giao diện) */}
            <div className="sidebar-actions">
                <a href="#" className="action-btn-main">
                    <i className="fa-solid fa-plus"></i>
                    <span>{t('sidebar.add_new')}</span>
                </a>
                <a href="#" className="action-btn-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav-scroll overflow-y-auto custom-scrollbar">
                <p className="nav-heading">{t('sidebar.pages')}</p>
                <ul className="flex flex-col gap-1.5">
                    {/* Dashboard */}
                    <li>
                        <Link href="/admin" className="nav-link">
                            <i className="fa-solid fa-chart-pie fa-fw"></i>
                            <span>{t('sidebar.overview')}</span>
                        </Link>
                    </li>

                    {/* Quản lý Đơn hàng & Hiển thị */}
                    <SidebarDropdown
                        icon="fa-solid fa-store fa-fw"
                        title={t('sidebar.store_management')}
                    >
                        <li>
                            <Link href="/admin/orders">
                                {t('sidebar.orders')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/banners">
                                {t('sidebar.banners')}
                            </Link>
                        </li>
                    </SidebarDropdown>

                    {/* Sản phẩm & Ngành hàng */}
                    <SidebarDropdown
                        icon="fa-solid fa-box-open fa-fw"
                        title={t('sidebar.catalog')}
                    >
                        <li>
                            <Link href="/admin/products">
                                {t('sidebar.all_products')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/categories">
                                {t('sidebar.categories')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/specifications">
                                {t('sidebar.specifications')}
                            </Link>
                        </li>
                    </SidebarDropdown>

                    {/* Kho bãi & Chuỗi cung ứng */}
                    <SidebarDropdown
                        icon="fa-solid fa-warehouse fa-fw"
                        title={t('sidebar.inventory')}
                    >
                        <li>
                            <Link href="/admin/stock-ins">
                                {t('sidebar.stock_ins')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/suppliers">
                                {t('sidebar.suppliers')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/warehouses">
                                {t('sidebar.warehouses')}
                            </Link>
                        </li>
                    </SidebarDropdown>

                    {/* Hệ thống & Nhân sự */}
                    <SidebarDropdown
                        icon="fa-solid fa-shield-halved fa-fw"
                        title={t('sidebar.system')}
                    >
                        <li>
                            <Link href="/admin/users">
                                {t('sidebar.users')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/team">
                                {t('sidebar.team_members')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/audit-logs">
                                {t('sidebar.audit_logs')}
                            </Link>
                        </li>
                    </SidebarDropdown>
                </ul>

                <p className="nav-heading mt-4">{t('sidebar.outline')}</p>
                <ul className="flex flex-col gap-1.5">
                    <li>
                        <a
                            href="https://facebook.com/vh.slown"
                            target="_blank"
                            rel="noreferrer"
                            className="nav-link"
                        >
                            <i className="fa-brands fa-facebook fa-fw"></i>
                            <span>@vh.slown</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link">
                            <i className="fa-brands fa-instagram fa-fw"></i>
                            <span>@vh.slow</span>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Bottom User Area */}
            <div className="sidebar-user" ref={userMenuRef}>
                <button
                    type="button"
                    className="user-avatar-button"
                    onClick={toggleUserMenu}
                >
                    <img
                        src={getAvatarSrc()}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left truncate">
                        <span className="block user-name truncate">
                            {user?.name || 'Administrator'}
                        </span>
                        <span className="block user-email truncate text-[11px]">
                            {user?.email || ''}
                        </span>
                    </div>
                    <i className="fa-solid fa-ellipsis-vertical ml-auto text-sidebar-link-color shrink-0"></i>
                </button>

                <div
                    className={`user-dropdown-menu ${isUserMenuOpen ? 'open' : ''}`}
                >
                    {/* Dropdown Header */}
                    <div className="dropdown-header">
                        <img
                            src={getAvatarSrc()}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="truncate w-full pr-2">
                            <span className="block user-name truncate">
                                {user?.name || 'Administrator'}
                            </span>
                            <span className="block user-email truncate">
                                {user?.email || ''}
                            </span>
                        </div>
                    </div>

                    {/* Dropdown Links */}
                    <ul className="dropdown-links">
                        <li>
                            <Link href="/admin/profile">
                                <i className="fa-regular fa-id-card fa-fw"></i>{' '}
                                {t('sidebar.my_profile')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/change-password">
                                <i className="fa-solid fa-lock fa-fw"></i>{' '}
                                {t('sidebar.change_password')}
                            </Link>
                        </li>

                        {/* Language Selector */}
                        <li className="relative">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsLangMenuOpen(!isLangMenuOpen);
                                }}
                                className={`flex items-center justify-between w-full transition-colors ${isLangMenuOpen ? 'text-blue-500' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-language fa-fw"></i>
                                    <span>{t('sidebar.language')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={
                                            LANGUAGES.find(
                                                (l) => l.code === language
                                            )?.icon
                                        }
                                        alt="Flag"
                                        className="w-5 rounded-sm shadow-sm"
                                    />
                                    <i
                                        className={`fa-solid fa-chevron-right text-[10px] transition-transform duration-200 ${isLangMenuOpen ? 'text-blue-500 rotate-90' : 'text-gray-400'} ml-1`}
                                    ></i>
                                </div>
                            </a>

                            {isLangMenuOpen && (
                                <div className="absolute left-[calc(100%+0.6rem)] bottom-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-up">
                                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                                            {t('sidebar.select_language')}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        {LANGUAGES.map((lang) => (
                                            <a
                                                key={lang.code}
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    changeLanguage(
                                                        lang.code as 'en' | 'vi'
                                                    );
                                                    setIsLangMenuOpen(false);
                                                    router.refresh();
                                                }}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${language === lang.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <img
                                                    src={lang.icon}
                                                    alt={lang.name}
                                                    className="w-5 rounded-sm shadow-sm"
                                                />
                                                {lang.name}
                                                {language === lang.code && (
                                                    <i className="fa-solid fa-check ml-auto text-blue-600"></i>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* Logout Button */}
                    <div className="dropdown-actions">
                        <a
                            href="#"
                            onClick={handleLogout}
                            className="logout-btn flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            {t('sidebar.logout')}
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    );
}
