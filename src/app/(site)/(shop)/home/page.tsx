'use client';

import BestSellers from '@/src/components/client/home/BestSellers';
import CategoriesSection from '@/src/components/client/home/Category';
import Features from '@/src/components/client/home/Features';
import Hero from '@/src/components/client/home/Hero';
import NewArrivals from '@/src/components/client/home/NewArrivals';

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <CategoriesSection />
            <NewArrivals />
            <BestSellers />
        </>
    );
}
