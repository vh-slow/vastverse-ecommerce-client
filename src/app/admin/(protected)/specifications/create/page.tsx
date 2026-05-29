'use client';

import React, { useState } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiSpecification } from '@/src/services';
import { useTranslation } from 'react-i18next';

export default function CreateSpecificationPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [specName, setSpecName] = useState<string>('');

    const handleSubmit = async (
        e: React.FormEvent,
        asDraft: boolean = false
    ) => {
        e.preventDefault();

        if (!specName.trim()) {
            toast.error(t('specifications.create.messages.validation_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: specName.trim(),
            };

            await apiSpecification.createSpecification(payload);

            toast.success(t('specifications.create.messages.create_success'));
            router.push('/admin/specifications');
        } catch (error: any) {
            console.error('Create specification error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('specifications.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('specifications.title'), href: '/admin/specifications' },
        { name: t('specifications.create.title') },
    ];

    return (
        <>
            <Header
                title={t('specifications.create.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form
                    className="space-y-8"
                    onSubmit={(e) => handleSubmit(e, false)}
                >
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('specifications.create.card_title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="spec-name"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('specifications.create.form.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="spec-name"
                                    value={specName}
                                    onChange={(e) =>
                                        setSpecName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'specifications.create.form.name_placeholder'
                                    )}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/specifications')}
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
