'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { formatCurrency } from '@/src/utils/formatters';
import { Category, Pagination, Product } from '@/src/types';
import { apiCategory, apiProduct, BASE_URL } from '@/src/services';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
    const { t } = useTranslation(['admin']);

    const [products, setProducts] = useState<Product[]>([]);
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

    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySearch, setCategorySearch] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const catDropdownRef = useRef<HTMLDivElement>(null);

    const [searchName, setSearchName] = useState<string>('');
    const [debouncedSearchName, setDebouncedSearchName] = useState<string>('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                PageNumber: currentPage + 1,
                PageSize: pageSize,
                IsDeleted: filterDeleted,
            };

            if (filterStatus === 'published') params.Status = 1;
            if (filterStatus === 'draft') params.Status = 0;

            if (selectedCategory && selectedCategory.id) {
                params.CategoryId = selectedCategory.id;
            }
            if (debouncedSearchName !== '')
                params.SearchQuery = debouncedSearchName;

            const response =
                await apiProduct.getProductsPaginationForAdmin(params);

            setProducts(response?.data || []);
            console.log(response);
            setPaginationInfo({
                pageNumber: response.pageNumber || 1,
                pageSize: response.pageSize || 5,
                totalRecords: response.totalRecords || 0,
                totalPages: response.totalPages || 0,
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        filterStatus,
        filterDeleted,
        selectedCategory,
        debouncedSearchName,
    ]);

    const handleDelete = async (id: number) => {
        try {
            await apiProduct.deleteProduct(id);
            toast.success(t('products.messages.delete_success'));
            fetchProducts();
        } catch (error) {
            toast.error(t('products.messages.delete_failed'));
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiProduct.restoreProduct(id);
            toast.success(t('products.messages.restore_success'));
            fetchProducts();
        } catch (error) {
            toast.error(t('products.messages.restore_failed'));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                catDropdownRef.current &&
                !catDropdownRef.current.contains(event.target as Node)
            ) {
                setIsCatDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getChildrenCategoriesForAdmin({
                    searchQuery: categorySearch,
                });
                setCategories(data || []);
            } catch (error) {
                console.error(t('products.messages.load_cat_error'), error);
            }
        };
        const timerId = setTimeout(fetchCategories, 300);
        return () => clearTimeout(timerId);
    }, [categorySearch, t]);

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
        selectedCategory,
        debouncedSearchName,
        pageSize,
    ]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('products.title') },
    ];

    return (
        <>
            <Header title={t('products.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/products/create" className="create-btn">
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
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
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

                            {/* Tabs Deleted */}
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

                            {/* Category Dropdown */}
                            <div
                                className="relative w-48 z-20"
                                ref={catDropdownRef}
                            >
                                <div
                                    className="border border-gray-300 rounded-md shadow-sm h-10 text-sm flex items-center justify-between px-3 cursor-pointer bg-white"
                                    onClick={() =>
                                        setIsCatDropdownOpen(!isCatDropdownOpen)
                                    }
                                >
                                    <span className="truncate text-gray-700">
                                        {selectedCategory
                                            ? selectedCategory.name
                                            : t(
                                                  'products.filter.all_categories'
                                              )}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                </div>

                                {isCatDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                                            <div className="relative">
                                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
                                                    placeholder={t(
                                                        'products.filter.search_category_placeholder'
                                                    )}
                                                    value={categorySearch}
                                                    onChange={(e) =>
                                                        setCategorySearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <ul className="max-h-60 overflow-y-auto">
                                            <li
                                                className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 text-blue-600 font-medium"
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setIsCatDropdownOpen(false);
                                                    setCategorySearch('');
                                                }}
                                            >
                                                {t(
                                                    'products.filter.all_categories'
                                                )}
                                            </li>
                                            {categories.length === 0 ? (
                                                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    {t(
                                                        'products.filter.category_not_found'
                                                    )}
                                                </li>
                                            ) : (
                                                categories.map((cat: any) => (
                                                    <li
                                                        key={cat.id}
                                                        className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                cat
                                                            );
                                                            setIsCatDropdownOpen(
                                                                false
                                                            );
                                                            setCategorySearch(
                                                                ''
                                                            );
                                                        }}
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {cat.name}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
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
                                        {t('common.table.name')}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        {t('products.table.category')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.status')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('products.table.stock')}
                                    </th>
                                    <th className="p-4 text-right font-semibold text-gray-600">
                                        {t('products.table.price')}
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        {t('common.table.action')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            {t('common.table.loading')}
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            {t('common.table.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product, index) => {
                                        const minPrice = Math.min(
                                            ...(product.variants?.map(
                                                (v) => v.price
                                            ) || [0])
                                        );
                                        const maxPrice = Math.max(
                                            ...(product.variants?.map(
                                                (v) => v.price
                                            ) || [0])
                                        );
                                        const priceDisplay =
                                            minPrice === maxPrice
                                                ? formatCurrency(minPrice)
                                                : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;

                                        const totalStock =
                                            product.variants?.reduce(
                                                (sum, v) =>
                                                    sum +
                                                    (v.stockQuantity || 0),
                                                0
                                            ) || 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-4 font-medium text-gray-500">
                                                    {currentPage * pageSize +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`${BASE_URL}${product.mainImage}`}
                                                            alt={product.name}
                                                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://placehold.co/40x40/f1f5f9/334155?text=Img';
                                                            }}
                                                        />
                                                        <div className="w-48">
                                                            <p
                                                                className="font-medium text-gray-800 truncate"
                                                                title={
                                                                    product.name
                                                                }
                                                            >
                                                                {product.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {product.categoryName ||
                                                        'N/A'}
                                                </td>

                                                <td className="p-4 text-center">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            product.status === 1
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {product.status === 1
                                                            ? t(
                                                                  'common.status_active'
                                                              )
                                                            : t(
                                                                  'common.status_draft'
                                                              )}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-center">
                                                    <span className="text-gray-600">
                                                        {totalStock}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-right">
                                                    <span className="text-gray-800 font-medium">
                                                        {priceDisplay}
                                                    </span>
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
                                                                        onClick={() =>
                                                                            handleRestore(
                                                                                product.id
                                                                            )
                                                                        }
                                                                        className="text-red-500"
                                                                    >
                                                                        <i className="fa-solid fa-trash fa-fw"></i>{' '}
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
                                                                            href={`/admin/products/update/${product.id}`}
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
                                                                                    product.id
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
                                        );
                                    })
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
