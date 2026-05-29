'use client';

import React, { useState } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiUser } from '@/src/services/user';
import { useTranslation } from 'react-i18next';

export default function CreateUserPage() {
    const { t } = useTranslation(['admin', 'common']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const [roleId, setRoleId] = useState<number>(3);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !roleId) {
            toast.error(t('users.create.messages.val_info_req'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || null,
                roleId: roleId,
            };

            await apiUser.createUser(payload);

            toast.success(t('users.create.messages.create_success'));
            router.push('/admin/users');
        } catch (error: any) {
            console.error('Create user error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('users.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('users.title'), href: '/admin/users' },
        { name: t('users.create.title') },
    ];

    return (
        <>
            <Header title={t('users.create.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('users.create.card_info')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('users.create.form.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'users.create.form.name_placeholder'
                                    )}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('users.create.form.email_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'users.create.form.email_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('users.create.form.phone_label')}
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'users.create.form.phone_placeholder'
                                    )}
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('users.create.form.role_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={roleId}
                                    onChange={(e) =>
                                        setRoleId(Number(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                                    required
                                >
                                    <option value={3}>
                                        {t('users.create.form.role_user')}
                                    </option>
                                    <option value={2}>
                                        {t('users.create.form.role_staff')}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/users')}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-70"
                        >
                            {t('common.actions.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-600/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>{' '}
                                    {t('common.actions.saving')}
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>{' '}
                                    {t('common.actions.save')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
