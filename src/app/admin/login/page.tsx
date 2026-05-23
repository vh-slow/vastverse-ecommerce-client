'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/src/components/shared/PageHeader';
import Link from 'next/link';

export default function LoginPage() {
    const { t } = useTranslation(['admin', 'client']);
    const [mounted, setMounted] = useState(false);

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email: userName, password: userPassword });

            router.push('/admin');
        } catch (err: any) {
            setError(t('login.messages.login_failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('client:shop.login.breadcrumbs.shop'), href: '/' },
        { name: t('client:shop.login.breadcrumbs.login') },
    ];

    if (!mounted) return null;

    return (
        <>
            <PageHeader
                title={t('client:shop.login.title')}
                breadcrumbs={breadcrumbs}
            />

            <section className="py-16 lg:py-20">
                <div className="container flex items-center justify-center bg-gray-50">
                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm max-w-md w-full mx-4">
                        <h1 className="text-3xl font-bold text-[#1e293b] text-center mb-2">
                            {t('login.title')}
                        </h1>
                        <p className="text-gray-500 text-center text-sm mb-8">
                            {t('login.subtitle')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('login.username_label')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t(
                                        'login.username_placeholder'
                                    )}
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('login.password_label')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder={t(
                                            'login.password_placeholder'
                                        )}
                                        value={userPassword}
                                        onChange={(e) =>
                                            setUserPassword(e.target.value)
                                        }
                                        required
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <i className="fa-regular fa-eye-slash"></i>
                                        ) : (
                                            <i className="fa-regular fa-eye"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {t('login.remember_me')}
                                </label>
                                <Link
                                    href="/admin/forgot-password"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    {t('login.forgot_password')}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-4 bg-[#1e293b] text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                ) : (
                                    t('login.sign_in_btn')
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
