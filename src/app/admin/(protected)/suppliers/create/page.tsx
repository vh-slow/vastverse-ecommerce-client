'use client';

import React, { useState } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiSupplier } from '@/src/services/supplier';
import { useTranslation } from 'react-i18next';

export default function CreateSupplierPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [taxCode, setTaxCode] = useState<string>('');
    const [status, setStatus] = useState<number>(1);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !contactName.trim()) {
            toast.error(t('suppliers.create.messages.val_info_req'));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('Name', name.trim());
            formData.append('ContactName', contactName.trim());
            if (phone.trim()) formData.append('Phone', phone.trim());
            if (email.trim()) formData.append('Email', email.trim());
            if (address.trim()) formData.append('Address', address.trim());
            if (taxCode.trim()) formData.append('TaxCode', taxCode.trim());

            formData.append('Status', status.toString());

            if (logoFile) {
                formData.append('LogoFile', logoFile);
            }

            await apiSupplier.createSupplier(formData);

            toast.success(t('suppliers.create.messages.create_success'));
            router.push('/admin/suppliers');
        } catch (error: any) {
            console.error('Create supplier error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('suppliers.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('suppliers.title'), href: '/admin/suppliers' },
        { name: t('suppliers.create.title') },
    ];

    return (
        <>
            <Header
                title={t('suppliers.create.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('suppliers.create.card_info')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.name_placeholder'
                                    )}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.contact_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={contactName}
                                    onChange={(e) =>
                                        setContactName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.contact_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.phone_label')}
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.phone_placeholder'
                                    )}
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.email_label')}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.email_placeholder'
                                    )}
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.tax_label')}
                                </label>
                                <input
                                    type="text"
                                    value={taxCode}
                                    onChange={(e) => setTaxCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.tax_placeholder'
                                    )}
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.status_label')}
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(Number(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                                >
                                    <option value={1}>
                                        {t('common.status_active')}
                                    </option>
                                    <option value={0}>
                                        {t('common.status_draft')}
                                    </option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('suppliers.create.form.address_label')}
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'suppliers.create.form.address_placeholder'
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('suppliers.create.card_media')}
                        </h2>

                        <div>
                            <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                {t('suppliers.create.form.logo_label')}
                            </label>

                            <div className="file-upload-zone relative overflow-hidden flex justify-center items-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        className="absolute inset-0 w-full h-full object-contain p-2 z-0 rounded-xl bg-white"
                                    />
                                ) : (
                                    <div className="text-center z-10 pointer-events-none">
                                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400"></i>
                                        <p className="mt-3 text-sm text-gray-600">
                                            <span className="font-semibold text-blue-600">
                                                {t('common.upload.click')}
                                            </span>{' '}
                                            {t('common.upload.drag')}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t('common.upload.hint')}
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleLogoChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                                    accept="image/*"
                                />

                                {logoPreview && (
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveLogo();
                                            }}
                                            className="w-10 h-10 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/suppliers')}
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
