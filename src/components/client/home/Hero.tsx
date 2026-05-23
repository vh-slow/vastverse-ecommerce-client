'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { initBannerCarousel } from '@/src/utils/bannerCarousel';
import { formatCurrency } from '@/src/utils/formatters';
import Spinner from '@/src/components/shared/Spinner';
import { useTranslation } from 'react-i18next';
import { Banner } from '@/src/types';
import { ProductCardItem } from '@/src/types/product';
import { apiBanner, BASE_URL } from '@/src/services';
import { apiProduct } from '@/src/services/product';

export default function Hero() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);

    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newArrivals, setNewArrivals] = useState<ProductCardItem[]>([]);
    const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await apiBanner.getBannersByPlacement(1);
                setBanners(data);
            } catch (error) {
                console.error('Failed to load banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const data = await apiProduct.getNewArrivals(2);
                setNewArrivals(data);
            } catch (error) {
                console.error('Failed to load new arrivals:', error);
            }
        };

        fetchNewArrivals();
    }, []);

    useEffect(() => {
        if (!loading && banners.length > 0 && !isCarouselInitialized) {
            const timeoutId = setTimeout(() => {
                initBannerCarousel();
                setIsCarouselInitialized(true);
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [loading, banners, isCarouselInitialized]);

    if (!mounted) return null;

    return (
        <section className="hero-section" id="hero">
            <div className="container">
                <div className="hero-grid">
                    {/* ===== CAROUSEL MAIN COLUMN ===== */}
                    <div className="hero-main-col">
                        <div className="banner-carousel relative min-h-[350px]">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Spinner />
                                </div>
                            ) : banners.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                                    <p className="text-gray-500 font-medium">
                                        {t('shop.home.hero.no_banners')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {banners.map((banner, index) => (
                                        <div
                                            key={banner.id}
                                            className={`carousel-slide ${index === 0 ? 'active-slide' : ''}`}
                                        >
                                            <div className="slide-content">
                                                <div className="flex items-baseline gap-3 mb-4">
                                                    <h2 className="sale-text">
                                                        {banner.subtitle}
                                                    </h2>
                                                </div>
                                                <h4 className="slide-title text-2xl">
                                                    {banner.title}
                                                </h4>
                                                <p className="slide-desc text-xs font-semibold">
                                                    {banner.description}
                                                </p>
                                                <Link
                                                    href={banner.linkUrl || '/'}
                                                    className="btn btn-primary mt-6"
                                                >
                                                    {banner.buttonText ||
                                                        t(
                                                            'shop.home.hero.button'
                                                        )}
                                                </Link>
                                            </div>
                                            <div className="slide-image">
                                                <div className="w-full max-w-[300px] aspect-square">
                                                    <img
                                                        src={
                                                            banner.imageUrl.startsWith(
                                                                'http'
                                                            )
                                                                ? banner.imageUrl
                                                                : `${BASE_URL}${banner.imageUrl}`
                                                        }
                                                        alt={
                                                            banner.title ||
                                                            'Banner'
                                                        }
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/300x300/f1f5f9/334155?text=Img';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {banners.length > 1 && (
                                        <>
                                            <button className="carousel-btn prev-btn">
                                                <i className="fa-solid fa-chevron-left"></i>
                                            </button>
                                            <button className="carousel-btn next-btn">
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                            <div className="carousel-indicators"></div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hero-side-col">
                        {newArrivals.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400 bg-gray-50 rounded-xl">
                                {t('shop.home.hero.no_products')}
                            </div>
                        ) : (
                            newArrivals.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="side-product"
                                >
                                    <div className="side-product-image">
                                        <img
                                            src={
                                                product.mainImage?.startsWith(
                                                    'http'
                                                )
                                                    ? product.mainImage
                                                    : `${BASE_URL}${product.mainImage}`
                                            }
                                            alt={product.name}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'https://placehold.co/150x150/f1f5f9/334155?text=Img';
                                            }}
                                        />
                                    </div>
                                    <div className="side-product-info">
                                        <h3
                                            className="side-product-title text-sm font-bold truncate block w-[160px] sm:w-full"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="offer-text text-xs font-semibold text-blue-500">
                                            {product.categoryName}{' '}
                                        </p>
                                        <p className="price">
                                            <span className="current-price">
                                                {formatCurrency(
                                                    product.minPrice
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
