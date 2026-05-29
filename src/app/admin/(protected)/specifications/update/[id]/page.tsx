'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiSpecification } from '@/src/services';
import { useTranslation } from 'react-i18next';

export default function UpdateSpecificationPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();
    const params = useParams();
    const specId = params?.id as string;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [specName, setSpecName] = useState<string>('');

    useEffect(() => {
        if (!specId) return;

        const loadSpecificationDetail = async () => {
            try {
                const data =
                    await apiSpecification.getSpecificationById(specId);
                setSpecName(data.data.name);
            } catch (error) {
                console.error(error);
                toast.error(t('specifications.update.messages.load_error'));
                router.push('/admin/specifications');
            } finally {
                setIsLoading(false);
            }
        };

        loadSpecificationDetail();
    }, [specId, router, t]);

    const handleSubmit = async (
        e: React.FormEvent,
        asDraft: boolean = false
    ) => {
        e.preventDefault();

        if (!specName.trim()) {
            toast.error(t('specifications.update.messages.validation_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: specName.trim(),
            };

            await apiSpecification.updateSpecification(specId, payload);

            toast.success(t('specifications.update.messages.update_success'));
            router.push('/admin/specifications');
        } catch (error: any) {
            console.error('Update specification error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('specifications.update.messages.update_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('specifications.title'), href: '/admin/specifications' },
        { name: t('specifications.update.title') },
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
            </div>
        );
    }

    return (
        <>
            <Header
                title={t('specifications.update.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form
                    className="space-y-8"
                    onSubmit={(e) => handleSubmit(e, false)}
                >
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('specifications.update.card_title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="spec-name"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('specifications.update.form.name_label')}{' '}
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
                                        'specifications.update.form.name_placeholder'
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
                                <>{t('common.actions.saving')}</>
                            ) : (
                                <>{t('common.actions.save_changes')}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
