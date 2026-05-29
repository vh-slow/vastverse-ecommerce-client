'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiAuditLog } from '@/src/services/auditLog';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
    formatDate,
    formatCurrency,
    getImageUrl,
} from '@/src/utils/formatters';

const parseRecordId = (recordIdStr: string) => {
    try {
        const parsed = JSON.parse(recordIdStr);
        const idValue = parsed.Id;

        if (typeof idValue === 'number' && idValue < 0) {
            return 'N/A';
        }

        return idValue || recordIdStr;
    } catch {
        return recordIdStr;
    }
};

export default function AuditLogsPage() {
    const { t } = useTranslation(['admin', 'common']);

    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    // Filters
    const [filterAction, setFilterAction] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState<string>('');

    // Modal State
    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    const fetchAuditLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
            };

            if (filterAction) params.Action = filterAction;
            if (fromDate) params.FromDate = fromDate;
            if (toDate) params.ToDate = toDate;
            if (debouncedSearchQuery !== '')
                params.SearchQuery = debouncedSearchQuery;

            const response =
                await apiAuditLog.getAuditLogsPaginationForAdmin(params);

            setLogs(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 10,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            toast.error(t('common.table.no_data'));
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        filterAction,
        fromDate,
        toDate,
        debouncedSearchQuery,
        t,
    ]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [filterAction, fromDate, toDate, debouncedSearchQuery, pageSize]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('audit_logs.title') },
    ];

    const renderFieldValue = (key: string, value: any) => {
        if (value === null || value === undefined) {
            return (
                <span className="text-gray-400 italic">
                    {t('audit_logs.modal.empty_data')}
                </span>
            );
        }

        const lowerKey = key.toLowerCase();

        if (
            lowerKey.includes('image') ||
            lowerKey.includes('avatar') ||
            lowerKey.includes('logo') ||
            lowerKey.includes('thumbnail')
        ) {
            return (
                <div className="w-16 h-16 rounded-md border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                    <img
                        src={getImageUrl(value as string)}
                        alt={key}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        if (lowerKey.includes('video')) {
            return (
                <div className="w-24 h-16 rounded-md border border-gray-200 overflow-hidden bg-black flex items-center justify-center">
                    <video
                        src={getImageUrl(value as string)}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        if (
            lowerKey.includes('price') ||
            lowerKey.includes('amount') ||
            lowerKey.includes('fee')
        ) {
            return (
                <span className="font-semibold text-gray-800">
                    {formatCurrency(Number(value))}
                </span>
            );
        }

        if (
            lowerKey.includes('date') ||
            lowerKey.includes('time') ||
            lowerKey.includes('at')
        ) {
            return (
                <span className="text-gray-700">
                    {formatDate(value as string)}
                </span>
            );
        }

        if (typeof value === 'boolean') {
            return value ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                    {t('audit_logs.modal.boolean_true')}
                </span>
            ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                    {t('audit_logs.modal.boolean_false')}
                </span>
            );
        }

        return <span className="text-gray-800 break-all">{String(value)}</span>;
    };

    const getDiffData = (
        oldJsonStr: string | null,
        newJsonStr: string | null
    ) => {
        let oldObj: Record<string, any> = {};
        let newObj: Record<string, any> = {};

        try {
            if (oldJsonStr) oldObj = JSON.parse(oldJsonStr);
        } catch (e) {}
        try {
            if (newJsonStr) newObj = JSON.parse(newJsonStr);
        } catch (e) {}

        const allKeys = Array.from(
            new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
        );

        return allKeys.map((key) => {
            const oldVal = oldObj[key];
            const newVal = newObj[key];
            const isChanged = JSON.stringify(oldVal) !== JSON.stringify(newVal);

            return {
                key,
                oldVal,
                newVal,
                isChanged,
            };
        });
    };

    return (
        <>
            <Header title={t('audit_logs.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
                    {/* Toolbar & Filters */}
                    <div className="p-4 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                            <span>{t('common.show')}</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(0);
                                }}
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>{t('common.entries')}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap justify-end">
                            <select
                                value={filterAction}
                                onChange={(e) =>
                                    setFilterAction(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg shadow-sm h-10 px-3 focus:border-blue-300 text-sm outline-none"
                            >
                                <option value="">
                                    {t('audit_logs.filter.all_actions')}
                                </option>
                                <option value="CREATE">
                                    {t('audit_logs.filter.create')}
                                </option>
                                <option value="UPDATE">
                                    {t('audit_logs.filter.update')}
                                </option>
                                <option value="DELETE">
                                    {t('audit_logs.filter.delete')}
                                </option>
                            </select>

                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-2 h-10 shadow-sm">
                                <span className="text-xs text-gray-500 font-medium">
                                    {t('audit_logs.filter.from_date')}:
                                </span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(e.target.value)
                                    }
                                    className="bg-transparent border-none text-sm outline-none w-28 text-gray-700"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-2 h-10 shadow-sm">
                                <span className="text-xs text-gray-500 font-medium">
                                    {t('audit_logs.filter.to_date')}:
                                </span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="bg-transparent border-none text-sm outline-none w-28 text-gray-700"
                                />
                            </div>

                            <div className="relative w-full sm:w-56">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full text-sm outline-none focus:border-blue-500 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-sm min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600 w-16">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('audit_logs.table.user')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('audit_logs.table.action')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('audit_logs.table.table_name')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('audit_logs.table.record_id')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('audit_logs.table.created_at')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 w-24">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && logs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, index) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4 font-semibold text-gray-800">
                                                {log.userName}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                                                        log.action === 'CREATE'
                                                            ? 'bg-green-100 text-green-700'
                                                            : log.action ===
                                                                'UPDATE'
                                                              ? 'bg-blue-100 text-blue-700'
                                                              : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-700 font-medium">
                                                {log.tableName}
                                            </td>
                                            <td className="p-4 text-center text-gray-500 font-mono text-xs">
                                                {parseRecordId(log.recordId)}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(log.createdAt)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedLog(log)
                                                    }
                                                    className="w-8 h-8 rounded-md text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-center mx-auto"
                                                    title={t(
                                                        'common.view_more'
                                                    )}
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
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

            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {t('audit_logs.modal.title')}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Bảng:{' '}
                                    <span className="font-semibold text-gray-700">
                                        {selectedLog.tableName}
                                    </span>{' '}
                                    | Hành động:{' '}
                                    <span className="font-semibold text-blue-600 mx-1">
                                        {selectedLog.action}
                                    </span>{' '}
                                    | Bởi:{' '}
                                    <span className="font-semibold text-gray-700">
                                        {selectedLog.userName}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200 text-left">
                                        <th className="p-3 font-semibold text-gray-700 w-1/4 rounded-tl-lg">
                                            {t('audit_logs.modal.field')}
                                        </th>
                                        <th className="p-3 font-semibold text-gray-700 w-3/8 border-l border-gray-200">
                                            {t('audit_logs.modal.old_val')}
                                        </th>
                                        <th className="p-3 font-semibold text-gray-700 w-3/8 border-l border-gray-200 rounded-tr-lg">
                                            {t('audit_logs.modal.new_val')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getDiffData(
                                        selectedLog.oldData,
                                        selectedLog.newData
                                    ).map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className={`border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors ${row.isChanged ? 'bg-yellow-50/10' : ''}`}
                                        >
                                            <td className="p-4 text-gray-600 font-medium align-middle">
                                                {row.key}
                                            </td>
                                            <td
                                                className={`p-4 align-middle border-l border-gray-100 ${row.isChanged ? 'bg-red-50/50' : ''}`}
                                            >
                                                {renderFieldValue(
                                                    row.key,
                                                    row.oldVal
                                                )}
                                            </td>
                                            <td
                                                className={`p-4 align-middle border-l border-gray-100 ${row.isChanged ? 'bg-green-50/50' : ''}`}
                                            >
                                                {renderFieldValue(
                                                    row.key,
                                                    row.newVal
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-5 border-t border-gray-100 flex justify-end bg-white">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                            >
                                {t('audit_logs.modal.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
