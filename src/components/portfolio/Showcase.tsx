'use client';

import React, { useEffect, useState } from 'react';
import { initShowcase } from '@/src/utils/portfolioScripts';
import { apiProduct, BASE_URL } from '@/src/services';
import Link from 'next/link';
import { ShowcaseCard } from './ShowcaseCard';

export default function Showcase() {
    const [showcaseProducts, setShowcaseProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const recentlyViewedIds: number[] = [];

                const payload: any = {
                    limit: 8,
                };

                if (recentlyViewedIds.length > 0) {
                    payload.recentlyViewedProductIds = recentlyViewedIds;
                }

                const res = await apiProduct.getShowcaseProducts(payload);

                setShowcaseProducts(res.data);
            } catch (error) {
                console.error('Error loading showcase data', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (showcaseProducts.length > 0) {
            const timer = setTimeout(() => {
                const cleanup = initShowcase();
                return cleanup;
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [showcaseProducts]);

    return (
        <section
            id="showcase"
            className="
                relative
                w-full
                py-16
                bg-[#0a0a0c]
                z-20
                border-t
                border-white/5
            "
        >
            {/* Header */}
            <div className="max-w-[90rem] mx-auto px-8 lg:px-16 mb-16 gsap-showcase-header gsap-hide">
                <span className="text-white uppercase tracking-widest text-xs font-bold mb-4 block">
                    capabilities
                </span>

                <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-4">
                    product showcase
                    <span className="text-[#3c50e0]">.</span>
                </h2>

                <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
                    Trải nghiệm công nghệ đột phá qua lăng kính của sự tự động
                    hóa toàn diện.
                </p>
            </div>

            {/* Grid */}
            <div
                className="
                    max-w-[90rem]
                    mx-auto
                    px-8
                    lg:px-16
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                "
            >
                {showcaseProducts.map((item) => (
                    <ShowcaseCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
