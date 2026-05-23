'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/src/components/shared/PageHeader';
import ProductCard from '@/src/components/client/ProductCard';
import ListProductCard from '@/src/components/client/ListProductCard';
import ProductCardLoading from '@/src/components/client/ProductCardLoading';
import ListProductCardLoading from '@/src/components/client/ListProductCardLoading';
import { apiCategory, apiProduct } from '@/src/services';
import { Pagination, Product, Category, ProductCardItem } from '@/src/types';
import { formatCurrency } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';

const mapProductToRecommend = (p: Product): ProductCardItem => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    minPrice:
        p.variants?.length > 0
            ? Math.min(...p.variants.map((v) => v.price))
            : 0,
    mainImage: p.mainImage,
    categoryName: p.categoryName,
    totalSales: 0,
});

function ProductsContent() {
    const { t } = useTranslation('client');
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryFromUrl = searchParams.get('query');
    const categoriesFromUrl = searchParams.getAll('category');
    const sortBy = searchParams.get('sort') || '';

    const [mounted, setMounted] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [selectedCategories, setSelectedCategories] =
        useState<string[]>(categoriesFromUrl);

    const [priceRange, setPriceRange] = useState({
        min_price: 0,
        max_price: 9999999999,
    });
    const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100000000 });

    const [productStyle, setProductStyle] = useState<'grid' | 'list'>('grid');

    const breadcrumbs = [
        { name: t('shop.products.breadcrumbs.home'), href: '/' },
        { name: t('shop.products.breadcrumbs.shop') },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getChildrenCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPriceBounds = async () => {
            try {
                const params: any = {};
                if (queryFromUrl) params.SearchQuery = queryFromUrl;
                if (selectedCategories.length > 0)
                    params.CategorySlugs = selectedCategories;

                const bounds = await apiProduct.getPriceBounds(params);
                const newMin = bounds.minPrice || 0;
                const newMax = bounds.maxPrice || 0;

                setPriceBounds({ min: newMin, max: newMax });
                setPriceRange({ min_price: newMin, max_price: newMax });
                setCurrentPage(1);
            } catch (error) {
                setPriceBounds({ min: 0, max: 100000000 });
                setPriceRange({ min_price: 0, max_price: 100000000 });
            }
        };
        fetchPriceBounds();
    }, [queryFromUrl, selectedCategories]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const params: any = {
                    PageNumber: currentPage,
                    PageSize: 12,
                    SortBy: sortBy,
                    MinPrice: priceRange.min_price,
                    MaxPrice: priceRange.max_price,
                };

                if (queryFromUrl) params.SearchQuery = queryFromUrl;
                if (selectedCategories.length > 0)
                    params.CategorySlugs = selectedCategories;

                const data = await apiProduct.getProducts(params);

                setProducts(data.data);
                setPagination({
                    pageNumber: data.pageNumber,
                    pageSize: data.pageSize,
                    totalRecords: data.totalRecords,
                    totalPages: data.totalPages,
                });
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, sortBy, selectedCategories, priceRange, queryFromUrl]);

    const handleSortChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newSort = e.target.value;
            const currentParams = new URLSearchParams(
                Array.from(searchParams.entries())
            );

            if (newSort) {
                currentParams.set('sort', newSort);
            } else {
                currentParams.delete('sort');
            }

            setCurrentPage(1);

            router.push(`/products?${currentParams.toString()}`, {
                scroll: false,
            });
        },
        [searchParams, router]
    );

    const handleCategoryChange = useCallback(
        (slug: string) => {
            const currentParams = new URLSearchParams(
                Array.from(searchParams.entries())
            );

            let newCategories = [];
            if (selectedCategories.includes(slug)) {
                newCategories = selectedCategories.filter((s) => s !== slug);
            } else {
                newCategories = [...selectedCategories, slug];
            }

            setSelectedCategories(newCategories);
            setCurrentPage(1);

            currentParams.delete('category');
            newCategories.forEach((c) => currentParams.append('category', c));

            router.push(`/products?${currentParams.toString()}`, {
                scroll: false,
            });
        },
        [selectedCategories, searchParams, router]
    );

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(
            Number(e.target.value),
            priceRange.max_price - 1
        );
        setPriceRange({ ...priceRange, min_price: value });
        setCurrentPage(1);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(
            Number(e.target.value),
            priceRange.min_price + 1
        );
        setPriceRange({ ...priceRange, max_price: value });
        setCurrentPage(1);
    };

    const handleCleanSearch = () => {
        setSelectedCategories([]);
        setCurrentPage(1);
        setPriceRange({
            min_price: priceBounds.min,
            max_price: priceBounds.max,
        });
        router.push('/products');
    };

    const handleProductStyleChange = (style: 'grid' | 'list') => {
        setProductStyle(style);
    };

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!mounted) return null;

    return (
        <>
            <PageHeader
                title={
                    queryFromUrl
                        ? t('shop.products.title_search', {
                              query: queryFromUrl,
                          })
                        : categoriesFromUrl.length === 1
                          ? `Danh mục: ${categories.find((c) => c.slug === categoriesFromUrl[0])?.name || ''}`
                          : t('shop.products.title_explore')
                }
                breadcrumbs={breadcrumbs}
            />

            <section className="py-8 lg:py-12 product-page">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* ================= LEFT COLUMN ================= */}
                        <aside className="md:col-span-3 space-y-6 lg:sticky lg:top-24">
                            {/* CATEGORY FILTER */}
                            <div className="filter-card open">
                                <button className="filter-header">
                                    <span>
                                        {t('shop.products.filters.category')}
                                    </span>
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                                <div className="filter-content">
                                    <div>
                                        <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                            {categories.map((cat) => (
                                                <li key={cat.id}>
                                                    <label
                                                        htmlFor={`cat-${cat.slug}`}
                                                        className="category-filter-row"
                                                    >
                                                        <input
                                                            id={`cat-${cat.slug}`}
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(
                                                                cat.slug
                                                            )}
                                                            onChange={() =>
                                                                handleCategoryChange(
                                                                    cat.slug
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-transparent cursor-pointer"
                                                        />
                                                        <span className="ml-3 flex-1 cursor-pointer hover:text-blue-600 transition-colors">
                                                            {cat.name}
                                                        </span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* PRICE FILTER */}
                            <div className="filter-card open">
                                <button className="filter-header">
                                    <span>
                                        {t('shop.products.filters.price')}
                                    </span>
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                                <div className="filter-content">
                                    <div>
                                        <div className="py-2 px-[4px]">
                                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                                <span>
                                                    {formatCurrency(
                                                        priceRange.min_price
                                                    )}
                                                </span>
                                                <span>
                                                    {formatCurrency(
                                                        priceRange.max_price
                                                    )}
                                                </span>
                                            </div>
                                            <div className="price-slider-container">
                                                <div
                                                    className="price-slider-progress"
                                                    style={{
                                                        left: `${priceBounds.max > priceBounds.min ? ((priceRange.min_price - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100 : 0}%`,
                                                        right: `${priceBounds.max > priceBounds.min ? 100 - ((priceRange.max_price - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100 : 0}%`,
                                                    }}
                                                ></div>
                                                <input
                                                    type="range"
                                                    min={priceBounds.min}
                                                    max={priceBounds.max}
                                                    value={priceRange.min_price}
                                                    onChange={
                                                        handleMinPriceChange
                                                    }
                                                    className="price-slider"
                                                />
                                                <input
                                                    type="range"
                                                    min={priceBounds.min}
                                                    max={priceBounds.max}
                                                    value={priceRange.max_price}
                                                    onChange={
                                                        handleMaxPriceChange
                                                    }
                                                    className="price-slider"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ================= RIGHT COLUMN ================= */}
                        <div className="md:col-span-9" id="product-container">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-[10.3px] rounded-xl mb-6 bg-white shadow-sm border border-gray-200">
                                <div className="text-sm">
                                    <span className="font-medium text-gray-700">
                                        {t(
                                            'shop.products.toolbar.filter_label'
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCleanSearch}
                                        className="text-blue-600 ml-2 hover:underline focus:outline-none"
                                    >
                                        {t(
                                            'shop.products.filters.clean_search'
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                    <div className="relative">
                                        <select
                                            className="custom-select bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none pr-8 cursor-pointer"
                                            value={sortBy}
                                            onChange={handleSortChange}
                                        >
                                            <option value="">
                                                {t(
                                                    'shop.products.toolbar.sort_default'
                                                )}
                                            </option>
                                            <option value="best_selling">
                                                {t(
                                                    'shop.products.toolbar.sort_best_selling'
                                                )}
                                            </option>
                                            <option value="newest">
                                                {t(
                                                    'shop.products.toolbar.sort_latest'
                                                )}
                                            </option>
                                            <option value="oldest">
                                                {t(
                                                    'shop.products.toolbar.sort_oldest'
                                                )}
                                            </option>
                                            <option value="price_asc">
                                                {t(
                                                    'shop.products.toolbar.sort_price_asc'
                                                )}
                                            </option>
                                            <option value="price_desc">
                                                {t(
                                                    'shop.products.toolbar.sort_price_desc'
                                                )}
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>

                                    <span className="text-sm text-gray-600 hidden lg:block">
                                        {t(
                                            'shop.products.toolbar.showing_text',
                                            {
                                                count: products.length,
                                                total:
                                                    pagination?.totalRecords ||
                                                    0,
                                            }
                                        )}
                                    </span>

                                    <div className="view-toggle">
                                        <button
                                            onClick={() =>
                                                handleProductStyleChange('grid')
                                            }
                                            className={`view-toggle-btn ${productStyle === 'grid' ? 'active' : ''}`}
                                            title={t(
                                                'shop.products.toolbar.grid_view'
                                            )}
                                        >
                                            <i className="fa-solid fa-grip"></i>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleProductStyleChange('list')
                                            }
                                            className={`view-toggle-btn ${productStyle === 'list' ? 'active' : ''}`}
                                            title={t(
                                                'shop.products.toolbar.list_view'
                                            )}
                                        >
                                            <i className="fa-solid fa-list"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MAIN CONTENT GRID */}
                            <div className="min-h-[500px]">
                                {loading ? (
                                    <div
                                        className={
                                            productStyle === 'grid'
                                                ? 'grid grid-cols-2 lg:grid-cols-3 gap-6'
                                                : 'space-y-6'
                                        }
                                    >
                                        {Array.from({ length: 6 }).map(
                                            (_, index) =>
                                                productStyle === 'grid' ? (
                                                    <ProductCardLoading
                                                        key={index}
                                                    />
                                                ) : (
                                                    <ListProductCardLoading
                                                        key={index}
                                                    />
                                                )
                                        )}
                                    </div>
                                ) : products.length === 0 ? (
                                    <div
                                        id="no-products-found"
                                        className="text-center bg-white p-12 rounded-xl border border-gray-200 shadow-sm"
                                    >
                                        <img
                                            src="/images/not-found-planet.png"
                                            alt=""
                                            className="mx-auto h-40 w-40 text-gray-300 opacity-50"
                                        />
                                        <h3 className="mt-6 text-xl font-bold text-primary">
                                            {t(
                                                'shop.products.no_products.title'
                                            )}
                                        </h3>
                                        <p className="mt-2 text-gray-500 text-sm">
                                            {t(
                                                'shop.products.no_products.desc_line1'
                                            )}
                                            <br />
                                            {t(
                                                'shop.products.no_products.desc_line2'
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            productStyle === 'grid'
                                                ? 'grid grid-cols-2 lg:grid-cols-3 gap-6'
                                                : 'space-y-6'
                                        }
                                    >
                                        {products.map((product) =>
                                            productStyle === 'grid' ? (
                                                <ProductCard
                                                    key={product.id}
                                                    product={mapProductToRecommend(
                                                        product
                                                    )}
                                                />
                                            ) : (
                                                <ListProductCard
                                                    key={product.id}
                                                    product={mapProductToRecommend(
                                                        product
                                                    )}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* PAGINATION */}
                            {pagination && pagination.totalPages > 1 && (
                                <nav className="mt-12 flex justify-center">
                                    <ul className="flex items-center gap-2">
                                        <li>
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={
                                                    currentPage === 1 || loading
                                                }
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {t(
                                                    'shop.products.pagination.prev'
                                                )}
                                            </button>
                                        </li>

                                        {Array.from(
                                            { length: pagination.totalPages },
                                            (_, i) => i + 1
                                        ).map((pageNumber) => (
                                            <li key={pageNumber}>
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNumber
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className={`w-10 h-10 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage ===
                                                        pageNumber
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        ))}

                                        <li>
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                        pagination.totalPages ||
                                                    loading
                                                }
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {t(
                                                    'shop.products.pagination.next'
                                                )}
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ProductsPageWrapper() {
    return (
        <Suspense
            fallback={
                <div className="h-screen flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
                </div>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}
