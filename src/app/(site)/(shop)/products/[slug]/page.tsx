'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/src/components/shared/PageHeader';
import { apiProduct, BASE_URL } from '@/src/services';
import { ProductDetail, ProductVariant } from '@/src/types';
import { formatCurrency } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';
import Spinner from '@/src/components/shared/Spinner';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { t } = useTranslation('client');
    const params = useParams();
    const slug = params.slug as string;

    const [mounted, setMounted] = useState(false);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            try {
                const data = await apiProduct.getProductBySlug(slug);
                setProduct(data);

                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (error) {
                console.error('Không tìm thấy sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity((prev) => prev - 1);
        } else if (
            type === 'increase' &&
            selectedVariant &&
            quantity < selectedVariant.stockQuantity
        ) {
            setQuantity((prev) => prev + 1);
        }
    };

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Spinner />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <h2 className="text-2xl font-bold text-gray-400">
                    Sản phẩm không tồn tại
                </h2>
            </div>
        );
    }

    const breadcrumbs = [
        { name: t('shop.products.breadcrumbs.home'), href: '/' },
        { name: t('shop.products.breadcrumbs.shop'), href: '/products' },
        { name: product.name },
    ];

    const getImageUrl = (url: string) => {
        if (!url)
            return 'https://placehold.co/600x600/f1f5f9/334155?text=No+Image';
        return url.startsWith('http') ? url : `${BASE_URL}${url}`;
    };

    const isOutOfStock =
        !selectedVariant || selectedVariant.stockQuantity === 0;

    return (
        <>
            <PageHeader title="Product Details" breadcrumbs={breadcrumbs} />

            {/* ===== PRODUCT DETAIL SECTION ===== */}
            <section className="py-12 lg:py-16">
                <div className="container">
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-5">
                            {/* Main Image */}
                            <div className="aspect-square w-full rounded-lg border border-gray-200 overflow-hidden mb-4 shadow-sm bg-gray-50 flex items-center justify-center">
                                <img
                                    src={getImageUrl(selectedImage)}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4"
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setSelectedImage(img)
                                            }
                                            className={`aspect-square rounded-md overflow-hidden transition bg-gray-50 ${
                                                selectedImage === img
                                                    ? 'border border-blue-500 ring-2 ring-blue-500 ring-offset-1 opacity-100'
                                                    : 'border border-gray-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRODUCT DETAILS (7/12) */}
                        <div className="lg:col-span-7">
                            {/* Product Name & Discount */}
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-3xl font-bold text-primary">
                                    {product.name}
                                </h1>
                                {/* <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">30% OFF</span> */}
                                {/* <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">30% OFF</span> */}
                            </div>

                            {/* Rating & Stock Status */}
                            <div className="flex items-center gap-4 mb-4 text-sm">
                                <div className="flex items-center text-yellow-400">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-regular fa-star text-gray-300"></i>
                                    <span className="ml-2 text-gray-500">
                                        {t('shop.product_detail.reviews_count')}
                                    </span>
                                </div>

                                {isOutOfStock ? (
                                    <span className="text-red-600 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-times-circle text-xs"></i>{' '}
                                        {t('shop.product_detail.out_of_stock')}
                                    </span>
                                ) : (
                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-check-circle text-xs"></i>{' '}
                                        {t('shop.product_detail.in_stock')}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-5">
                                <span className="text-2xl font-bold text-primary mr-2">
                                    {selectedVariant
                                        ? formatCurrency(selectedVariant.price)
                                        : '0 ₫'}
                                </span>
                                {/* <span className="text-xl text-gray-400 line-through">$99</span> */}
                            </div>

                            {/* Short Description */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {product.description ||
                                    'Chưa có mô tả chi tiết cho sản phẩm này.'}
                            </p>

                            {/* Additional Info/Policies */}
                            <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                <li className="flex items-center gap-2">
                                    <i className="fa-solid fa-check text-blue-500 w-4 text-center"></i>
                                    {t('shop.product_detail.free_delivery')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fa-solid fa-check text-blue-500 w-4 text-center"></i>
                                    {t('shop.product_detail.discount_code')}{' '}
                                    <span className="font-semibold text-gray-800 ml-1">
                                        VASTVERSE30
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fa-solid fa-check text-blue-500 w-4 text-center"></i>
                                    {t('shop.product_detail.return_policy')}
                                </li>
                            </ul>

                            {/* Attributes (Variants) */}
                            {product.variants &&
                                product.variants.length > 0 && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            {t(
                                                'shop.product_detail.variant_label'
                                            )}
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.variants.map((variant) => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() =>
                                                        setSelectedVariant(
                                                            variant
                                                        )
                                                    }
                                                    className={`attribute-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                                                >
                                                    {variant.variantName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                                <div className="quantity-input">
                                    <button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() =>
                                            handleQuantityChange('decrease')
                                        }
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        min="1"
                                        max={
                                            selectedVariant?.stockQuantity || 1
                                        }
                                        className="text-center outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() =>
                                            handleQuantityChange('increase')
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="btn btn-primary flex-1 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isOutOfStock}
                                >
                                    {t('shop.product_detail.purchase_now')}
                                </button>
                                <button
                                    className="btn btn-secondary flex-1 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isOutOfStock}
                                >
                                    {t('shop.product_detail.add_to_cart')}
                                </button>
                            </div>

                            {/* Category & Brand */}
                            <div className="mt-6 text-sm text-gray-500 border-t pt-4">
                                <p>
                                    {t('shop.product_detail.category_label')}{' '}
                                    <Link
                                        href={`/products?category=${product.slug}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {product.categoryName}
                                    </Link>
                                </p>
                                {/* <p>{t('shop.product_detail.brand_label')} <Link href="#" className="text-blue-600 hover:underline">VastVerse</Link></p> */}
                            </div>
                        </div>
                    </div>

                    {/* YOU MIGHT ALSO LIKE */}
                    <div className="mt-8 lg:mt-6 pt-10">
                        <h2 className="text-2xl font-bold text-primary mb-6">
                            {t('shop.product_detail.you_might_also_like')}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Related Product 1 */}
                            <div className="product-card">
                                <div className="product-image-wrapper">
                                    <a href="#">
                                        <img
                                            src="https://placehold.co/300x300/f0f9ff/3b82f6?text=Related+1"
                                            alt="Related Product 1"
                                        />
                                    </a>
                                    <div className="product-actions">
                                        <button
                                            className="action-btn btn-circle"
                                            title="Quick View"
                                        >
                                            <i className="fa-regular fa-eye"></i>
                                        </button>
                                        <button className="action-btn btn-main">
                                            Add to cart
                                        </button>
                                        <button
                                            className="action-btn btn-circle"
                                            title="Add to Wishlist"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <a href="#">
                                            Apple iMac M4 24-inch 2025
                                        </a>
                                    </h3>
                                    <p className="product-price">
                                        <span className="current-price">
                                            $333
                                        </span>
                                        <span className="original-price">
                                            $555
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Related Product 2 */}
                            <div className="product-card">
                                <div className="product-image-wrapper">
                                    <a href="#">
                                        <img
                                            src="https://placehold.co/300x300/ecfdf5/22c55e?text=Related+2"
                                            alt="Related Product 2"
                                        />
                                    </a>
                                    <div className="product-actions">
                                        <button
                                            className="action-btn btn-circle"
                                            title="Quick View"
                                        >
                                            <i className="fa-regular fa-eye"></i>
                                        </button>
                                        <button className="action-btn btn-main">
                                            Add to cart
                                        </button>
                                        <button
                                            className="action-btn btn-circle"
                                            title="Add to Wishlist"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <a href="#">Apple AirPods Max</a>
                                    </h3>
                                    <p className="product-price">
                                        <span className="current-price">
                                            $450
                                        </span>
                                        <span className="original-price">
                                            $500
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Related Product 3 */}
                            <div className="product-card">
                                <div className="product-image-wrapper">
                                    <a href="#">
                                        <img
                                            src="https://placehold.co/300x300/fef2f2/ef4444?text=Related+3"
                                            alt="Related Product 3"
                                        />
                                    </a>
                                    <div className="product-actions">
                                        <button
                                            className="action-btn btn-circle"
                                            title="Quick View"
                                        >
                                            <i className="fa-regular fa-eye"></i>
                                        </button>
                                        <button className="action-btn btn-main">
                                            Add to cart
                                        </button>
                                        <button
                                            className="action-btn btn-circle"
                                            title="Add to Wishlist"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <a href="#">iPhone 16 Pro Max</a>
                                    </h3>
                                    <p className="product-price">
                                        <span className="current-price">
                                            $899
                                        </span>
                                        <span className="original-price">
                                            $930
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Related Product 4 */}
                            <div className="product-card">
                                <div className="product-image-wrapper">
                                    <a href="#">
                                        <img
                                            src="https://placehold.co/300x300/f5f5f5/737373?text=Related+4"
                                            alt="Related Product 4"
                                        />
                                    </a>
                                    <div className="product-actions">
                                        <button
                                            className="action-btn btn-circle"
                                            title="Quick View"
                                        >
                                            <i className="fa-regular fa-eye"></i>
                                        </button>
                                        <button className="action-btn btn-main">
                                            Add to cart
                                        </button>
                                        <button
                                            className="action-btn btn-circle"
                                            title="Add to Wishlist"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <a href="#">
                                            MacBook Air M4 chip, 16/256GB
                                        </a>
                                    </h3>
                                    <p className="product-price">
                                        <span className="current-price">
                                            $600
                                        </span>
                                        <span className="original-price">
                                            $699
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
