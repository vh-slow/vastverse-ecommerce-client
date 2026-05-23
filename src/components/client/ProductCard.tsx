'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BASE_URL } from '@/src/services';
import { formatCurrency } from '@/src/utils/formatters';
// import { apiCart } from '@/src/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ProductCardItem } from '@/src/types';

interface ProductCardProps {
    product: ProductCardItem;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useTranslation('client');
    const router = useRouter();
    const { user } = useAuth();

    const handleAddToCart = async () => {
        try {
            // await apiCart.addToCart(product.id, 1);
            toast.success(t('shop.product_card.messages.add_success'));
        } catch (error: any) {
            console.error('Failed to add to cart', error);
            toast.error(t('shop.product_card.messages.add_failed'));
        }
    };

    const handleQuickView = () => {
        router.push(`/products/${product.slug}`);
    };

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <Link href={`/products/${product.slug}`}>
                    <img
                        src={
                            product.mainImage?.startsWith('http')
                                ? product.mainImage
                                : `${BASE_URL}${product.mainImage}`
                        }
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.src =
                                'https://placehold.co/300x300/f1f5f9/334155?text=No+Image';
                        }}
                    />
                </Link>
                <div className="product-actions">
                    <button
                        onClick={handleQuickView}
                        className="action-btn btn-circle"
                        title={t('shop.product_card.quick_view')}
                    >
                        <i className="fa-regular fa-eye"></i>
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="action-btn btn-main"
                    >
                        {t('shop.product_card.add_to_cart')}
                    </button>
                    <button
                        className="action-btn btn-circle"
                        title={t('shop.product_card.add_to_wishlist')}
                    >
                        <i className="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>
            <div className="product-info">
                <span className="text-xs text-blue-500 font-medium mb-1 block">
                    {product.categoryName}
                </span>

                <h3 className="product-title">
                    <Link href={`/products/${product.slug}`}>
                        <span className="truncate block" title={product.name}>
                            {product.name}
                        </span>
                    </Link>
                </h3>

                <p className="product-price">
                    {/* {product.salePrice && product.salePrice < product.price ? (
                        <>
                            <span className="current-price">
                                {formatCurrency(product.salePrice)}
                            </span>
                            <span className="original-price">
                                {formatCurrency(product.price)}
                            </span>
                        </>
                    ) : (
                        <span className="current-price">
                            {formatCurrency(product.price)}
                        </span>
                    )} 
                    */}

                    <span className="current-price">
                        {formatCurrency(product.minPrice)}
                    </span>
                </p>
            </div>
        </div>
    );
}
