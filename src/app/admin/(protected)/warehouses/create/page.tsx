'use client';

import React, { useState } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiWarehouse } from '@/src/services/warehouse';
import { useTranslation } from 'react-i18next';

export default function CreateWarehousePage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [contactPhone, setContactPhone] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');
    const [provinceId, setProvinceId] = useState<number | ''>('');
    const [districtId, setDistrictId] = useState<number | ''>('');
    const [wardCode, setWardCode] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !contactName || !contactPhone || !addressDetail) {
            toast.error(t('warehouses.create.messages.validation_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: name.trim(),
                contactName: contactName.trim(),
                contactPhone: contactPhone.trim(),
                addressDetail: addressDetail.trim(),
                provinceId: Number(provinceId) || 0,
                districtId: Number(districtId) || 0,
                wardCode: wardCode.trim(),
                isActive: isActive,
            };

            await apiWarehouse.createWarehouse(payload);

            toast.success(t('warehouses.create.messages.create_success'));
            router.push('/admin/warehouses');
        } catch (error: any) {
            console.error('Create warehouse error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('warehouses.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('warehouses.title'), href: '/admin/warehouses' },
        { name: t('warehouses.create.title') },
    ];

    return (
        <>
            <Header
                title={t('warehouses.create.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('warehouses.create.card_title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="warehouse-name"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="warehouse-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'warehouses.create.form.name_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.contact_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contact-name"
                                    value={contactName}
                                    onChange={(e) =>
                                        setContactName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'warehouses.create.form.contact_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-phone"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.phone_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contact-phone"
                                    value={contactPhone}
                                    onChange={(e) =>
                                        setContactPhone(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'warehouses.create.form.phone_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="address-detail"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.address_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address-detail"
                                    value={addressDetail}
                                    onChange={(e) =>
                                        setAddressDetail(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'warehouses.create.form.address_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="province-id"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.province_label')}
                                </label>
                                <input
                                    type="number"
                                    id="province-id"
                                    value={provinceId}
                                    onChange={(e) =>
                                        setProvinceId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : ''
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="district-id"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.district_label')}
                                </label>
                                <input
                                    type="number"
                                    id="district-id"
                                    value={districtId}
                                    onChange={(e) =>
                                        setDistrictId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : ''
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="ward-code"
                                    className="form-label mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('warehouses.create.form.ward_label')}
                                </label>
                                <input
                                    type="text"
                                    id="ward-code"
                                    value={wardCode}
                                    onChange={(e) =>
                                        setWardCode(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="W..."
                                />
                            </div>

                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="is-active"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(e.target.checked)
                                    }
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label
                                    htmlFor="is-active"
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    {t(
                                        'warehouses.create.form.is_active_label'
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/warehouses')}
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
                                    {t('warehouses.create.actions.saving')}
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
