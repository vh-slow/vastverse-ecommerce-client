'use client';

import React from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ProductCardItem } from '@/src/types';
import { formatCurrency } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { BASE_URL } from '@/src/services';

interface ListProductCardProps {
    product: ProductCardItem;
}

export default function ListProductCard({ product }: ListProductCardProps) {
    const { t } = useTranslation('client');
    const { user } = useAuth();
    const router = useRouter();

    const handleAddToCart = async () => {
        try {
            // await apiCart.addToCart(product.id, 1);
            toast.success(t('shop.product_card.messages.add_success'));
        } catch (error: any) {
            console.error('Failed to add to cart', error);
            toast.error(t('shop.product_card.messages.add_failed'));
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-hover hover:shadow-md">
            <Link
                href={`/products/${product.slug}`}
                className="block sm:w-1/4 lg:w-1/5 shrink-0 overflow-hidden rounded-lg aspect-square bg-gray-50"
            >
                <img
                    src={
                        product.mainImage?.startsWith('http')
                            ? product.mainImage
                            : `${BASE_URL}${product.mainImage}`
                    }
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 p-2"
                    onError={(e) => {
                        e.currentTarget.src =
                            'https://placehold.co/300x300/f1f5f9/334155?text=No+Image';
                    }}
                />
            </Link>

            <div className="flex flex-col flex-1 justify-between py-2">
                <div>
                    <span className="text-xs text-blue-500 font-medium mb-1 block">
                        {product.categoryName}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        <Link
                            href={`/products/${product.slug}`}
                            className="hover:text-blue-600 transition-colors line-clamp-2"
                            title={product.name}
                        >
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {t('shop.product_card.no_desc')}
                    </p>

                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 inline-block">
                        {t('shop.product_card.in_stock')}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="product-price text-lg m-0">
                        <span className="current-price">
                            {formatCurrency(product.minPrice)}
                        </span>
                    </p>

                    <button
                        className="btn btn-secondary px-4 py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAddToCart}
                    >
                        {t('shop.product_card.add_to_cart')}
                    </button>
                </div>
            </div>
        </div>
    );
}
