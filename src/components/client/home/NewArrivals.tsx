'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ProductCardItem } from '@/src/types/product';
import { apiProduct } from '@/src/services/product';
import ProductCard from '../ProductCard';

export default function NewArrivals() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);

    const [products, setProducts] = useState<ProductCardItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const data = await apiProduct.getNewArrivals(4);
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch new arrivals', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (!mounted) return null;

    return (
        <section className="section-wrapper" id="new-arrivals">
            <div className="container">
                <div className="section-header">
                    <div className="section-title-group">
                        <p className="section-subtitle">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>{' '}
                            {t('shop.home.new_arrivals.subtitle')}
                        </p>
                        <h2 className="section-title">
                            {t('shop.home.new_arrivals.title')}
                        </h2>
                    </div>
                    <div className="section-controls">
                        <Link
                            href="/products?sort=newest"
                            className="control-btn btn-outline"
                        >
                            {t('shop.home.new_arrivals.view_all')}
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
                            {t('shop.home.new_arrivals.no_products')}
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
