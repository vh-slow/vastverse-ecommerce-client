'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { Pagination } from '@/src/types';
import { apiUser } from '@/src/services/user';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formatDate, getImageUrl } from '@/src/utils/formatters';

export default function UsersPage() {
    const { t } = useTranslation(['admin', 'common']);

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterStatus, setFilterStatus] = useState<
        'all' | 'active' | 'banned'
    >('all');

    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const roleDropdownRef = useRef<HTMLDivElement>(null);

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
            };

            if (filterStatus === 'active') params.Status = 1;
            if (filterStatus === 'banned') params.Status = 2;

            if (selectedRole && selectedRole.id) {
                params.RoleId = selectedRole.id;
            }

            if (debouncedSearchName !== '') {
                params.SearchQuery = debouncedSearchName;
            }

            const response = await apiUser.getUsersPaginationForAdmin(params);

            setUsers(response?.data?.data || []);
            setPaginationInfo({
                pageNumber: response?.data?.pageNumber || 1,
                pageSize: response?.data?.pageSize || 10,
                totalRecords: response?.data?.totalRecords || 0,
                totalPages: response?.data?.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error(t('common.table.no_data'));
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        filterStatus,
        selectedRole,
        debouncedSearchName,
        t,
    ]);

    const handleToggleStatus = async (
        id: string,
        currentStatus: string,
        roleName: string
    ) => {
        if (roleName === 'Admin') {
            toast.error(t('users.messages.admin_error'));
            return;
        }

        const isCurrentlyActive = currentStatus === 'Active';
        const confirmMsg = isCurrentlyActive
            ? t('users.messages.confirm_lock')
            : t('users.messages.confirm_unlock');

        if (!confirm(confirmMsg)) return;

        try {
            const newStatus = isCurrentlyActive ? 2 : 1;
            await apiUser.changeUserStatus(id, newStatus);
            toast.success(t('users.messages.status_success'));
            fetchUsers();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    t('users.messages.status_failed')
            );
        }
    };

    const handleChangeRole = async (
        id: string,
        newRoleId: number,
        confirmMsg: string
    ) => {
        if (!confirm(confirmMsg)) return;

        try {
            await apiUser.changeUserRole(id, newRoleId);
            toast.success(t('users.messages.role_success'));
            fetchUsers();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || t('users.messages.role_failed')
            );
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(event.target as Node)
            ) {
                setIsRoleDropdownOpen(false);
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
    }, [filterStatus, selectedRole, debouncedSearchName, pageSize]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('users.title') },
    ];

    return (
        <>
            <Header title={t('users.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/users/create" className="create-btn">
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

                        <div className="flex items-center gap-3">
                            {/* Tabs Status */}
                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`filter-tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                >
                                    {t('common.filter_all')}
                                </button>
                                <button
                                    onClick={() => setFilterStatus('active')}
                                    className={`filter-tab-btn ${filterStatus === 'active' ? 'active' : ''}`}
                                >
                                    {t('common.user_active')}
                                </button>
                                <button
                                    onClick={() => setFilterStatus('banned')}
                                    className={`filter-tab-btn ${filterStatus === 'banned' ? 'active' : ''}`}
                                >
                                    {t('common.user_banned')}
                                </button>
                            </div>

                            {/* Role Dropdown */}
                            <div
                                className="relative w-48 z-20"
                                ref={roleDropdownRef}
                            >
                                <div
                                    className="border border-gray-300 rounded-md shadow-sm h-10 text-sm flex items-center justify-between px-3 cursor-pointer bg-white"
                                    onClick={() =>
                                        setIsRoleDropdownOpen(
                                            !isRoleDropdownOpen
                                        )
                                    }
                                >
                                    <span className="truncate text-gray-700">
                                        {selectedRole
                                            ? selectedRole.name
                                            : t('users.filter.all_roles')}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                </div>

                                {isRoleDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <ul className="max-h-60 overflow-y-auto">
                                            <li
                                                className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 text-blue-600 font-medium"
                                                onClick={() => {
                                                    setSelectedRole(null);
                                                    setIsRoleDropdownOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                {t('users.filter.all_roles')}
                                            </li>
                                            {[
                                                {
                                                    id: 1,
                                                    name: t(
                                                        'users.filter.admin'
                                                    ),
                                                },
                                                {
                                                    id: 2,
                                                    name: t(
                                                        'users.filter.staff'
                                                    ),
                                                },
                                                {
                                                    id: 3,
                                                    name: t(
                                                        'users.filter.user'
                                                    ),
                                                },
                                            ].map((role) => (
                                                <li
                                                    key={role.id}
                                                    className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col"
                                                    onClick={() => {
                                                        setSelectedRole(role);
                                                        setIsRoleDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    <span className="font-semibold text-gray-800">
                                                        {role.name}
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
                                        {t('users.table.account')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('users.table.phone')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('users.table.role')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.status')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('users.table.created_at')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {user.avatar ? (
                                                        <img
                                                            src={getImageUrl(
                                                                user.avatar
                                                            )}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white shrink-0 shadow-sm"
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://placehold.co/40x40/dbeafe/2563eb?text=${user.name.charAt(0).toUpperCase()}`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-200 shrink-0 shadow-sm">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="w-48">
                                                        <p
                                                            className="font-medium text-gray-800 truncate"
                                                            title={user.name}
                                                        >
                                                            {user.name}
                                                        </p>
                                                        <p
                                                            className="text-gray-500 text-xs truncate"
                                                            title={user.email}
                                                        >
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {user.phone || 'N/A'}
                                            </td>

                                            <td className="p-4 text-center">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
        ${
            user.roleName === 'Admin'
                ? 'bg-rose-500/10 text-rose-400'
                : user.roleName === 'Staff'
                  ? 'bg-sky-500/10 text-sky-400'
                  : user.roleName === 'User'
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'bg-gray-500/10 text-gray-400'
        }`}
                                                >
                                                    {user.roleName === 'Admin'
                                                        ? t(
                                                              'users.filter.admin'
                                                          )
                                                        : user.roleName ===
                                                            'Staff'
                                                          ? t(
                                                                'users.filter.staff'
                                                            )
                                                          : user.roleName ===
                                                              'User'
                                                            ? t(
                                                                  'users.filter.user'
                                                              )
                                                            : user.roleName}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {user.status === 'Active'
                                                        ? t(
                                                              'common.user_active'
                                                          )
                                                        : t(
                                                              'common.user_banned'
                                                          )}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(user.createdAt)}
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
                                                        <li>
                                                            <Link
                                                                href={`/admin/users/detail/${user.id}`}
                                                            >
                                                                <i className="fa-solid fa-eye fa-fw"></i>{' '}
                                                                {t(
                                                                    'common.view_more'
                                                                )}
                                                            </Link>
                                                        </li>

                                                        {user.roleName !==
                                                            'Admin' && (
                                                            <>
                                                                <li>
                                                                    <a
                                                                        href="#"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleToggleStatus(
                                                                                user.id,
                                                                                user.status,
                                                                                user.roleName
                                                                            );
                                                                        }}
                                                                        className={
                                                                            user.status ===
                                                                            'Active'
                                                                                ? 'text-red-500'
                                                                                : 'text-green-600'
                                                                        }
                                                                    >
                                                                        <i
                                                                            className={`fa-solid ${user.status === 'Active' ? 'fa-lock' : 'fa-unlock'} fa-fw`}
                                                                        ></i>{' '}
                                                                        {user.status ===
                                                                        'Active'
                                                                            ? t(
                                                                                  'users.actions.lock'
                                                                              )
                                                                            : t(
                                                                                  'users.actions.unlock'
                                                                              )}
                                                                    </a>
                                                                </li>

                                                                {user.roleName ===
                                                                    'User' && (
                                                                    <li>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                handleChangeRole(
                                                                                    user.id,
                                                                                    2,
                                                                                    t(
                                                                                        'users.messages.confirm_promote'
                                                                                    )
                                                                                );
                                                                            }}
                                                                            className="text-blue-600"
                                                                        >
                                                                            <i className="fa-solid fa-arrow-up fa-fw"></i>{' '}
                                                                            {t(
                                                                                'users.actions.promote'
                                                                            )}
                                                                        </a>
                                                                    </li>
                                                                )}
                                                                {user.roleName ===
                                                                    'Staff' && (
                                                                    <li>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                handleChangeRole(
                                                                                    user.id,
                                                                                    3,
                                                                                    t(
                                                                                        'users.messages.confirm_demote'
                                                                                    )
                                                                                );
                                                                            }}
                                                                            className="text-orange-500"
                                                                        >
                                                                            <i className="fa-solid fa-arrow-down fa-fw"></i>{' '}
                                                                            {t(
                                                                                'users.actions.demote'
                                                                            )}
                                                                        </a>
                                                                    </li>
                                                                )}
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
