'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Category } from '@/src/types';
import { initCategorySlider } from '@/src/utils/categorySlider';
import Spinner from '@/src/components/shared/Spinner';
import { useTranslation } from 'react-i18next';
import { apiCategory, BASE_URL } from '@/src/services';

export default function CategoriesSection() {
    const { t } = useTranslation('client');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await apiCategory.getChildrenCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!categories.length) return;

        const cleanup = initCategorySlider();

        return () => {
            cleanup?.();
        };
    }, [categories]);

    return (
        <section className="section-wrapper">
            <div className="container">
                <div className="section-header">
                    <div className="section-title-group">
                        <p className="section-subtitle">
                            <i className="fa-solid fa-tags"></i>{' '}
                            {t('shop.home.categories.subtitle')}
                        </p>
                        <h2 className="section-title">
                            {t('shop.home.categories.title')}
                        </h2>
                    </div>

                    <div className="section-controls">
                        <button className="control-btn btn-circle category-prev-btn">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button className="control-btn btn-circle category-next-btn">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[150px]">
                        <Spinner />
                    </div>
                ) : (
                    <div className="category-slider-viewport">
                        <div className="category-grid">
                            {categories.map((category, index) => (
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className="category-item"
                                    key={category.id || index}
                                >
                                    <div className="category-image-wrapper">
                                        <img
                                            src={
                                                category.image?.startsWith(
                                                    'http'
                                                )
                                                    ? category.image
                                                    : `${BASE_URL}${category.image}`
                                            }
                                            alt={category.name}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'https://placehold.co/100x100/f1f5f9/334155?text=Cat';
                                            }}
                                        />
                                    </div>
                                    <span className="category-name">
                                        {category.name}
                                    </span>
                                </Link>
                            ))}

                            <Link href="/products" className="category-item">
                                <div className="category-image-wrapper">
                                    <img
                                        src="/images/ic_more.png"
                                        alt="more"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/100x100/f1f5f9/334155?text=+';
                                        }}
                                    />
                                </div>
                                <span className="category-name text-blue-600 font-semibold">
                                    {t('shop.home.categories.more')}
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
