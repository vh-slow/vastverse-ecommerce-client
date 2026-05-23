import Footer from '@/src/components/portfolio/Footer';
import Header from '@/src/components/portfolio/Header';
import React from 'react';

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            id="vastverse-module"
            className="bg-[#0a0a0c] text-white relative w-full"
        >
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
