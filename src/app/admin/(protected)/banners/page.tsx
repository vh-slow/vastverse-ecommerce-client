'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiBanner } from '@/src/services/banner';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formatDate, getImageUrl } from '@/src/utils/formatters';

export default function BannersPage() {
    const { t } = useTranslation(['admin']);

    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterStatus, setFilterStatus] = useState<
        'all' | 'published' | 'draft'
    >('all');
    const [filterDeleted, setFilterDeleted] = useState<boolean>(false);

    const [filterPlacement, setFilterPlacement] = useState<string>('');

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const fetchBanners = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
                IsDeleted: filterDeleted,
            };

            if (filterStatus === 'published') params.IsActive = true;
            if (filterStatus === 'draft') params.IsActive = false;

            if (filterPlacement !== '') {
                params.Placement = Number(filterPlacement);
            }

            if (debouncedSearchName !== '')
                params.SearchQuery = debouncedSearchName;

            const response =
                await apiBanner.getBannersPaginationForAdmin(params);

            setBanners(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 5,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        filterStatus,
        filterDeleted,
        filterPlacement,
        debouncedSearchName,
    ]);

    const handleDelete = async (id: number) => {
        try {
            await apiBanner.deleteBanner(id);
            toast.success(t('banners.messages.delete_success'));
            fetchBanners();
        } catch (error) {
            toast.error(t('banners.messages.delete_failed'));
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiBanner.restoreBanner(id);
            toast.success(t('banners.messages.restore_success'));
            fetchBanners();
        } catch (error) {
            toast.error(t('banners.messages.restore_failed'));
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchName]);

    useEffect(() => {
        setCurrentPage(0);
    }, [
        filterStatus,
        filterDeleted,
        filterPlacement,
        debouncedSearchName,
        pageSize,
    ]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('banners.title') },
    ];

    return (
        <>
            <Header title={t('banners.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/banners/create" className="create-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.25rem"
                            height="1.25rem"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        >
                            <path d="M12 19v-7m0 0V5m0 7H5m7 0h7"></path>
                        </svg>
                        {t('common.create')}
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{t('common.show')}</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(0);
                                }}
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span>{t('common.entries')}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`filter-tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                >
                                    {t('common.filter_all')}
                                </button>
                                <button
                                    onClick={() => setFilterStatus('published')}
                                    className={`filter-tab-btn ${filterStatus === 'published' ? 'active' : ''}`}
                                >
                                    {t('common.filter_published')}
                                </button>
                                <button
                                    onClick={() => setFilterStatus('draft')}
                                    className={`filter-tab-btn ${filterStatus === 'draft' ? 'active' : ''}`}
                                >
                                    {t('common.filter_draft')}
                                </button>
                            </div>

                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterDeleted(false)}
                                    className={`filter-tab-btn ${!filterDeleted ? 'active' : ''}`}
                                >
                                    {t('common.filter_active')}
                                </button>
                                <button
                                    onClick={() => setFilterDeleted(true)}
                                    className={`filter-tab-btn ${filterDeleted ? 'active' : ''}`}
                                >
                                    {t('common.filter_deleted')}
                                </button>
                            </div>

                            <select
                                value={filterPlacement}
                                onChange={(e) =>
                                    setFilterPlacement(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg shadow-sm h-10 focus:border-blue-300 text-sm"
                            >
                                <option value="">
                                    {t('banners.filter.all_placements')}
                                </option>
                                <option value="1">
                                    {t('banners.filter.home_hero')}
                                </option>
                                <option value="2">
                                    {t('banners.filter.portfolio')}
                                </option>
                            </select>

                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    value={searchName}
                                    onChange={(e) =>
                                        setSearchName(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full sm:w-48 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('banners.table.title')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('banners.table.placement')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.status')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('banners.table.order')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('banners.table.created_at')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && banners.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : banners.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    banners.map((banner, index) => (
                                        <tr
                                            key={banner.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {banner.placementId === 2 &&
                                                    banner.videoUrl ? (
                                                        <video
                                                            src={getImageUrl(
                                                                banner.videoUrl
                                                            )}
                                                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                            muted
                                                            loop
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={getImageUrl(
                                                                banner.imageUrl
                                                            )}
                                                            alt={banner.title}
                                                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://placehold.co/40x40/f1f5f9/334155?text=Img';
                                                            }}
                                                        />
                                                    )}
                                                    <div className="w-48">
                                                        <p
                                                            className="font-medium text-gray-800 truncate"
                                                            title={banner.title}
                                                        >
                                                            {banner.title}
                                                        </p>
                                                        <p
                                                            className="text-gray-500 text-xs truncate"
                                                            title={
                                                                banner.subtitle
                                                            }
                                                        >
                                                            {banner.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium
        ${
            banner.placement === 'HomeHero'
                ? 'bg-cyan-100 text-cyan-700'
                : 'bg-fuchsia-100 text-fuchsia-700'
        }`}
                                                >
                                                    {banner.placement ===
                                                    'HomeHero'
                                                        ? 'Home'
                                                        : banner.placement ===
                                                            'PortfolioVideo'
                                                          ? 'Portfolio'
                                                          : 'N/A'}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        banner.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {banner.isActive
                                                        ? t(
                                                              'common.status_active'
                                                          )
                                                        : t(
                                                              'common.status_draft'
                                                          )}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center text-gray-600">
                                                {banner.displayOrder}
                                            </td>

                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(banner.createdAt)}
                                            </td>

                                            <td className="p-4 text-center">
                                                <div
                                                    className="relative inline-block text-left"
                                                    data-te-dropdown-ref
                                                >
                                                    <button
                                                        className="w-8 h-8 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                                                        data-te-dropdown-toggle-ref
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                    <ul
                                                        className="action-dropdown"
                                                        data-te-dropdown-menu-ref
                                                    >
                                                        {filterDeleted ? (
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleRestore(
                                                                            banner.id
                                                                        );
                                                                    }}
                                                                    className="text-blue-600"
                                                                >
                                                                    <i className="fa-solid fa-rotate-left fa-fw"></i>{' '}
                                                                    {t(
                                                                        'common.restore'
                                                                    )}
                                                                </a>
                                                            </li>
                                                        ) : (
                                                            <>
                                                                <li>
                                                                    <a href="#">
                                                                        <i className="fa-solid fa-eye fa-fw"></i>{' '}
                                                                        {t(
                                                                            'common.view_more'
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <Link
                                                                        href={`/admin/banners/update/${banner.id}`}
                                                                    >
                                                                        <i className="fa-solid fa-pen fa-fw"></i>{' '}
                                                                        {t(
                                                                            'common.update'
                                                                        )}
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        href="#"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleDelete(
                                                                                banner.id
                                                                            );
                                                                        }}
                                                                        className="text-red-500"
                                                                    >
                                                                        <i className="fa-solid fa-trash fa-fw"></i>{' '}
                                                                        {t(
                                                                            'common.delete'
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {paginationInfo && (
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <span className="text-sm text-gray-600">
                                {t('common.pagination.showing')}{' '}
                                {paginationInfo.totalRecords > 0
                                    ? currentPage * pageSize + 1
                                    : 0}{' '}
                                {t('common.pagination.to')}{' '}
                                {Math.min(
                                    (currentPage + 1) * pageSize,
                                    paginationInfo.totalRecords
                                )}{' '}
                                {t('common.pagination.of')}{' '}
                                {paginationInfo.totalRecords}{' '}
                                {t('common.pagination.entries')}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 0}
                                    className="px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    {t('common.pagination.previous')}
                                </button>

                                {Array.from({
                                    length: paginationInfo.totalPages,
                                }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`w-9 h-9 border border-gray-400 rounded-md ${
                                            currentPage === idx
                                                ? 'bg-blue-600 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        currentPage >=
                                            paginationInfo.totalPages - 1 ||
                                        paginationInfo.totalPages === 0
                                    }
                                    className="px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    {t('common.pagination.next')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
