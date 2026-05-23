import AuthGuard from '@/src/components/admin/auth/AuthGuard';
import Footer from '@/src/components/admin/Footer';
import Sidebar from '@/src/components/admin/Sidebar';

import React from 'react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="admin-wrap flex h-screen">
                {/* ===== SIDEBAR ===== */}
                <Sidebar />

                {/* ===== MAIN CONTENT WRAPPER ===== */}
                <main className="flex-1 bg-white h-screen overflow-y-auto rounded-l-xl flex flex-col">
                    {children}

                    <Footer />
                </main>
            </div>
        </AuthGuard>
    );
}
