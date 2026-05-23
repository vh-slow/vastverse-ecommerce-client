'use client';

import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation('admin');
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isLoading || !mounted) {
            return;
        }

        const allowedRoles = ['Admin', 'Staff'];

        if (!user || !allowedRoles.includes(user.role)) {
            if (!user) {
                toast.error(t('auth_guard.unauthenticated'));
            } else {
                toast.error(t('auth_guard.unauthorized'));
            }

            router.push('/admin/login');
        }
    }, [user, isLoading, router, t, mounted]);

    if (!mounted || isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center text-gray-500 font-medium bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
                    {mounted && <span>{t('auth_guard.loading')}</span>}
                </div>
            </div>
        );
    }

    if (user && ['Admin', 'Staff'].includes(user.role)) {
        return <>{children}</>;
    }

    return null;
}
