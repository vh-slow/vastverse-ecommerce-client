'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCardItem } from '@/src/types';
import RatingProductCard from '@/src/components/client/RatingProductCard';
import { useTranslation } from 'react-i18next';
import { apiProduct } from '@/src/services';

export default function BestSellers() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);

    const [products, setProducts] = useState<ProductCardItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const data = await apiProduct.getBestSellers(4);
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch best sellers', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    if (!mounted) return null;

    return (
        <section className="section-wrapper" id="on-sellers">
            <div className="container">
                <div className="section-header">
                    <div className="section-title-group">
                        <p className="section-subtitle">
                            <i className="fa-solid fa-arrow-trend-up"></i>{' '}
                            {t('shop.home.on_sellers.subtitle')}
                        </p>
                        <h2 className="section-title">
                            {t('shop.home.on_sellers.title')}
                        </h2>
                    </div>
                    <div className="section-controls">
                        <Link
                            href="/products?sort=best-selling"
                            className="control-btn btn-outline"
                        >
                            {t('shop.home.on_sellers.view_all')}
                        </Link>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="product-grid relative min-h-[300px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-gray-400"></i>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            {t('shop.home.on_sellers.no_products')}
                        </div>
                    ) : (
                        products.map((product) => (
                            <RatingProductCard
                                key={product.id}
                                product={product}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
