import BackToTop from '@/src/components/client/BackToTop';
import Footer from '@/src/components/client/Footer';
import Header from '@/src/components/client/Header';
import React from 'react';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="site-wrapper app-wrap">
            <Header />
            <main>{children}</main>
            <Footer />
            <BackToTop />
        </div>
    );
}
