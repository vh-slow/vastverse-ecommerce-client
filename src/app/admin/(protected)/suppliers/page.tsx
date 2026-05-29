'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiSupplier } from '@/src/services/supplier';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formatDate, getImageUrl } from '@/src/utils/formatters';

export default function SuppliersPage() {
    const { t } = useTranslation(['admin']);

    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterDeleted, setFilterDeleted] = useState<boolean>(false);

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const tableDropdownRef = useRef<HTMLDivElement>(null);

    const fetchSuppliers = useCallback(async () => {
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
                await apiSupplier.getSuppliersPaginationForAdmin(params);

            setSuppliers(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 10,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch suppliers:', error);
            toast.error(t('common.table.no_data'));
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterDeleted, debouncedSearchName, t]);

    const handleDelete = async (id: number) => {
        try {
            await apiSupplier.deleteSupplier(id);
            toast.success(t('suppliers.messages.delete_success'));
            fetchSuppliers();
        } catch (error: any) {
            const backendMsg =
                error.response?.data?.Message || error.response?.data?.message;

            if (backendMsg && backendMsg.includes('nhập kho')) {
                toast.error(t('suppliers.messages.delete_has_transaction'));
            } else if (backendMsg) {
                toast.error(backendMsg);
            } else {
                toast.error(t('suppliers.messages.delete_failed'));
            }
        } finally {
            setOpenDropdownId(null);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiSupplier.restoreSupplier(id);
            toast.success(t('suppliers.messages.restore_success'));
            fetchSuppliers();
        } catch (error) {
            toast.error(t('suppliers.messages.restore_failed'));
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
        fetchSuppliers();
    }, [fetchSuppliers]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('suppliers.title') },
    ];

    return (
        <>
            <Header title={t('suppliers.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/suppliers/create" className="create-btn">
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
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span>{t('common.entries')}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="filter-tabs flex gap-1 bg-gray-100 p-1 rounded-lg">
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
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600 w-16">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('suppliers.table.name')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('suppliers.table.contact')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('suppliers.table.phone_email')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('suppliers.table.tax_code')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.status')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('suppliers.table.created_at')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 w-24">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && suppliers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : suppliers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.map((supplier, index) => (
                                        <tr
                                            key={supplier.id}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getImageUrl(
                                                            supplier.logoUrl
                                                        )}
                                                        alt={supplier.name}
                                                        className="w-10 h-10 rounded-lg object-contain border border-gray-200 bg-white"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/40x40/f1f5f9/334155?text=Logo';
                                                        }}
                                                    />
                                                    <div className="w-40">
                                                        <p
                                                            className="font-semibold text-gray-800 truncate"
                                                            title={
                                                                supplier.name
                                                            }
                                                        >
                                                            {supplier.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">
                                                {supplier.contactName}
                                            </td>
                                            <td className="p-4">
                                                <p className="text-gray-800 font-medium">
                                                    {supplier.phone}
                                                </p>
                                                <p
                                                    className="text-gray-500 text-xs truncate"
                                                    title={supplier.email}
                                                >
                                                    {supplier.email}
                                                </p>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {supplier.taxCode || '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                                                        supplier.status === 1
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-gray-50 text-gray-600 border'
                                                    }`}
                                                >
                                                    {supplier.status === 1
                                                        ? t(
                                                              'common.status_active'
                                                          )
                                                        : t(
                                                              'common.status_draft'
                                                          )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(supplier.createdAt)}
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
                                                                    supplier.id
                                                                    ? null
                                                                    : supplier.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                    <ul
                                                        className={`action-dropdown ${openDropdownId === supplier.id ? 'block' : 'hidden'}`}
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
                                                                            supplier.id
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
                                                                        href={`/admin/suppliers/update/${supplier.id}`}
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
                                                                                supplier.id
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
