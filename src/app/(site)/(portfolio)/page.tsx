'use client';
import React, { useEffect } from 'react';
import { initGlobalGsap } from '@/src/utils/portfolioScripts';
import Hero from '@/src/components/portfolio/Hero';
import Supplier from '@/src/components/portfolio/Supplier';
import Innovation from '@/src/components/portfolio/Innovation';
import Showcase from '@/src/components/portfolio/Showcase';
import Team from '@/src/components/portfolio/Team';

export default function PortfolioPage() {
    useEffect(() => {
        initGlobalGsap();
    }, []);

    return (
        <>
            <Hero />
            <Supplier />
            <Innovation />
            <Showcase />
            <Team />
        </>
    );
}
