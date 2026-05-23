import React from 'react';
import Link from 'next/link';
import { BASE_URL } from '@/src/services';
import { formatCurrency } from '@/src/utils/formatters';
import { ProductCardItem } from '@/src/types';

export interface RatingProduct extends ProductCardItem {
    rating?: number;
    reviewCount?: number;
}

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const stars = [];

    // full stars
    for (let i = 1; i <= Math.floor(rating); i++) {
        stars.push(
            <i
                key={`full_${i}`}
                className="fa-solid fa-star text-yellow-400"
            ></i>
        );
    }

    // half star
    if (rating % 1 !== 0) {
        stars.push(
            <i
                key="half"
                className="fa-solid fa-star-half-stroke text-yellow-400"
            ></i>
        );
    }

    // empty stars
    const emptyStars = totalStars - Math.ceil(rating);
    for (let i = 1; i <= emptyStars; i++) {
        stars.push(
            <i
                key={`empty_${i}`}
                className="fa-regular fa-star text-gray-300"
            ></i>
        );
    }

    return <>{stars}</>;
};

export default function RatingProductCard({
    product,
}: {
    product: RatingProduct;
}) {
    const imageUrl = product.mainImage
        ? `${BASE_URL}${product.mainImage}`
        : 'https://placehold.co/300x300/f1f5f9/334155?text=No+Image';

    return (
        <div className="most-viewed-card">
            <div className="card-info-top">
                <div className="rating text-xs mb-1">
                    {/* <StarRating rating={product.rating || 5} /> */}
                    <span className="review-count ml-1 text-gray-500">
                        ({product.reviewCount || product.totalSales || 0})
                    </span>
                </div>

                <h3 className="product-title pt-1">
                    <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2"
                        title={product.name}
                    >
                        {product.name}
                    </Link>
                </h3>

                <p className="product-price mt-2">
                    <span className="current-price text-blue-600 font-bold">
                        {formatCurrency(product.minPrice)}
                    </span>
                </p>
            </div>

            <div className="card-image-bottom">
                <Link href={`/products/${product.slug}`}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.src =
                                'https://placehold.co/300x300/f1f5f9/334155?text=No+Image';
                        }}
                    />
                </Link>
            </div>
        </div>
    );
}
