'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiSpecification } from '@/src/services';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function SpecificationsPage() {
    const { t } = useTranslation(['admin']);

    const [specifications, setSpecifications] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterDeleted, setFilterDeleted] = useState<boolean>(false);

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const tableDropdownRef = useRef<HTMLDivElement>(null);

    const fetchSpecifications = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
                IsDeleted: filterDeleted,
            };

            if (debouncedSearchName !== '')
                params.SearchQuery = debouncedSearchName;

            const response =
                await apiSpecification.getSpecificationsPaginationForAdmin(
                    params
                );

            setSpecifications(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 10,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch specifications:', error);
            toast.error(t('common.table.no_data'));
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterDeleted, debouncedSearchName, t]);

    const handleDelete = async (id: number) => {
        try {
            await apiSpecification.deleteSpecification(id);
            toast.success(t('specifications.messages.delete_success'));
            fetchSpecifications();
        } catch (error) {
            toast.error(t('specifications.messages.delete_failed'));
        } finally {
            setOpenDropdownId(null);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiSpecification.restoreSpecification(id);
            toast.success(t('specifications.messages.restore_success'));
            fetchSpecifications();
        } catch (error) {
            toast.error(t('specifications.messages.restore_failed'));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tableDropdownRef.current &&
                !tableDropdownRef.current.contains(event.target as Node)
            ) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchName]);

    useEffect(() => {
        setCurrentPage(0);
    }, [filterDeleted, debouncedSearchName, pageSize]);

    useEffect(() => {
        fetchSpecifications();
    }, [fetchSpecifications]);

    const breadcrumbs = [
        {
            name: t('common.dashboard', { defaultValue: 'Dashboard' }),
            href: '/admin',
        },
        {
            name: t('specifications.title', {
                defaultValue: 'Thông số kỹ thuật',
            }),
        },
    ];

    return (
        <>
            <Header
                title={t('specifications.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link
                        href="/admin/specifications/create"
                        className="create-btn"
                    >
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
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                            </select>
                            <span>{t('common.entries')}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Tabs Deleted */}
                            {/* <div className="filter-tabs flex gap-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setFilterDeleted(false)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        !filterDeleted
                                            ? 'bg-white shadow text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {t('common.filter_active')}
                                </button>
                                <button
                                    onClick={() => setFilterDeleted(true)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        filterDeleted
                                            ? 'bg-white shadow text-red-600'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {t('common.filter_deleted')}
                                </button>
                            </div> */}

                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    value={searchName}
                                    onChange={(e) =>
                                        setSearchName(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="w-full text-sm min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600 w-16">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('specifications.table.name')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 w-24">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${
                                    loading
                                        ? 'opacity-50 pointer-events-none'
                                        : 'opacity-100'
                                }`}
                            >
                                {loading && specifications.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : specifications.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    specifications.map((spec, index) => (
                                        <tr
                                            key={spec.id}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4 font-medium text-gray-800">
                                                {spec.name}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div
                                                    className="relative inline-block text-left"
                                                    data-te-dropdown-ref
                                                >
                                                    <button
                                                        className="w-8 h-8 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                                                        data-te-dropdown-toggle-ref
                                                        onClick={() =>
                                                            setOpenDropdownId(
                                                                openDropdownId ===
                                                                    spec.id
                                                                    ? null
                                                                    : spec.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                    <ul
                                                        className={`action-dropdown ${openDropdownId === spec.id ? 'block' : 'hidden'}`}
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
                                                                            spec.id
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
                                                                    <Link
                                                                        href={`/admin/specifications/update/${spec.id}`}
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
                                                                                spec.id
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
                    {paginationInfo && paginationInfo.totalRecords > 0 && (
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                            <span className="text-sm text-gray-600">
                                {t('common.pagination.showing')}{' '}
                                <span>{currentPage * pageSize + 1}</span>{' '}
                                {t('common.pagination.to')}{' '}
                                <span>
                                    {Math.min(
                                        (currentPage + 1) * pageSize,
                                        paginationInfo.totalRecords
                                    )}
                                </span>{' '}
                                {t('common.pagination.of')}{' '}
                                <span>{paginationInfo.totalRecords}</span>{' '}
                                {t('common.pagination.entries')}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 0}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <i className="fa-solid fa-chevron-left text-xs mr-1"></i>{' '}
                                    {t('common.pagination.previous')}
                                </button>

                                {Array.from({
                                    length: paginationInfo.totalPages,
                                }).map((_, idx) => {
                                    if (
                                        idx === 0 ||
                                        idx === paginationInfo.totalPages - 1 ||
                                        (idx >= currentPage - 1 &&
                                            idx <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    setCurrentPage(idx)
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                                                    currentPage === idx
                                                        ? 'bg-blue-600 text-white border-transparent'
                                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    } else if (
                                        idx === currentPage - 2 ||
                                        idx === currentPage + 2
                                    ) {
                                        return (
                                            <span
                                                key={idx}
                                                className="text-gray-400"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        currentPage >=
                                            paginationInfo.totalPages - 1 ||
                                        paginationInfo.totalPages === 0
                                    }
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                >
                                    {t('common.pagination.next')}{' '}
                                    <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
