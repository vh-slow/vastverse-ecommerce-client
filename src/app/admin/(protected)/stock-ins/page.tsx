'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiStockIn } from '@/src/services/stockIn';
import { apiSupplier } from '@/src/services/supplier';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formatDate, formatCurrency } from '@/src/utils/formatters';

export default function StockInsPage() {
    const { t } = useTranslation(['admin']);

    const [stockIns, setStockIns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    // Filters
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const supplierDropdownRef = useRef<HTMLDivElement>(null);

    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const fetchStockIns = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
            };

            if (selectedSupplier && selectedSupplier.id) {
                params.SupplierId = selectedSupplier.id;
            }
            if (fromDate) params.FromDate = fromDate;
            if (toDate) params.ToDate = toDate;
            if (debouncedSearchName !== '')
                params.SearchQuery = debouncedSearchName;

            const response =
                await apiStockIn.getStockInsPaginationForAdmin(params);

            setStockIns(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 10,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch stock-ins:', error);
            toast.error(t('common.table.no_data'));
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        selectedSupplier,
        fromDate,
        toDate,
        debouncedSearchName,
        t,
    ]);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const res = await apiSupplier.getSuppliersPaginationForAdmin({
                    PageSize: 100,
                    Status: 1,
                });
                setSuppliers(res?.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        loadSuppliers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                supplierDropdownRef.current &&
                !supplierDropdownRef.current.contains(event.target as Node)
            ) {
                setIsSupplierDropdownOpen(false);
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
    }, [selectedSupplier, fromDate, toDate, debouncedSearchName, pageSize]);

    useEffect(() => {
        fetchStockIns();
    }, [fetchStockIns]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('stock_ins.title') },
    ];

    return (
        <>
            <Header title={t('stock_ins.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/stock-ins/create" className="create-btn">
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
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span>{t('common.entries')}</span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap justify-end">
                            {/* Filter Dates */}
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 rounded-md shadow-sm h-10 px-2 text-sm text-gray-600 focus:border-blue-300 outline-none"
                            />
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 rounded-md shadow-sm h-10 px-2 text-sm text-gray-600 focus:border-blue-300 outline-none"
                            />

                            {/* Supplier Dropdown */}
                            <div
                                className="relative w-48 z-20"
                                ref={supplierDropdownRef}
                            >
                                <div
                                    className="border border-gray-300 rounded-md shadow-sm h-10 text-sm flex items-center justify-between px-3 cursor-pointer bg-white"
                                    onClick={() =>
                                        setIsSupplierDropdownOpen(
                                            !isSupplierDropdownOpen
                                        )
                                    }
                                >
                                    <span className="truncate text-gray-700">
                                        {selectedSupplier
                                            ? selectedSupplier.name
                                            : t(
                                                  'stock_ins.filter.all_suppliers'
                                              )}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                </div>
                                {isSupplierDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <ul className="max-h-60 overflow-y-auto">
                                            <li
                                                className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 text-blue-600 font-medium"
                                                onClick={() => {
                                                    setSelectedSupplier(null);
                                                    setIsSupplierDropdownOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                {t(
                                                    'stock_ins.filter.all_suppliers'
                                                )}
                                            </li>
                                            {suppliers.map((sup: any) => (
                                                <li
                                                    key={sup.id}
                                                    className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col"
                                                    onClick={() => {
                                                        setSelectedSupplier(
                                                            sup
                                                        );
                                                        setIsSupplierDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    <span className="font-semibold text-gray-800">
                                                        {sup.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Search */}
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
                                        {t('stock_ins.table.supplier')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('stock_ins.table.creator')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('stock_ins.table.note')}
                                    </th>
                                    <th className="p-4 text-right font-semibold text-gray-600">
                                        {t('stock_ins.table.total_amount')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('stock_ins.table.created_at')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && stockIns.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : stockIns.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    stockIns.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-800">
                                                    {item.supplierName}
                                                </p>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {item.creatorName}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                <p
                                                    className="truncate w-48"
                                                    title={item.note}
                                                >
                                                    {item.note || '-'}
                                                </p>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-gray-800 font-semibold text-blue-600">
                                                    {formatCurrency(
                                                        item.totalAmount
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    href={`/admin/stock-ins/detail/${item.id}`}
                                                    className="text-blue-500 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors font-medium"
                                                >
                                                    <i className="fa-solid fa-eye mr-1"></i>{' '}
                                                </Link>
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
