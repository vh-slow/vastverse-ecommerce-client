'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiTeam } from '@/src/services/team';
import { getImageUrl } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';

export default function UpdateTeamMemberPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();
    const params = useParams();
    const memberId = params?.id as string;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [fullName, setFullName] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [displayOrder, setDisplayOrder] = useState<string>('0');
    const [isActive, setIsActive] = useState<number>(1);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) return;

        const loadMemberDetail = async () => {
            try {
                const data = await apiTeam.getTeamMemberById(memberId);

                setFullName(data.fullName || '');
                setPosition(data.position || '');
                setBio(data.bio || '');
                setDisplayOrder(data.displayOrder?.toString() || '0');
                setIsActive(data.isActive ? 1 : 0);

                if (data.avatarUrl) {
                    setAvatarPreview(getImageUrl(data.avatarUrl));
                }
            } catch (error) {
                console.error(error);
                toast.error(t('team.update.messages.load_error'));
                router.push('/admin/team-members');
            } finally {
                setIsLoading(false);
            }
        };

        loadMemberDetail();
    }, [memberId, router, t]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !position.trim()) {
            toast.error(t('team.update.messages.val_info_req'));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('FullName', fullName.trim());
            formData.append('Position', position.trim());

            if (bio.trim()) {
                formData.append('Bio', bio.trim());
            }

            formData.append('DisplayOrder', displayOrder);
            formData.append('IsActive', isActive === 1 ? 'true' : 'false');

            if (avatarFile) {
                formData.append('AvatarFile', avatarFile);
            }

            await apiTeam.updateTeamMember(memberId, formData);

            toast.success(t('team.update.messages.update_success'));
            router.push('/admin/team-members');
        } catch (error: any) {
            console.error('Update team member error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('team.update.messages.update_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('team.title'), href: '/admin/team-members' },
        { name: t('team.update.title') },
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
            <Header title={t('team.update.title')} breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('team.update.card_info')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('team.update.form.fullname_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'team.update.form.fullname_placeholder'
                                    )}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('team.update.form.position_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={position}
                                    onChange={(e) =>
                                        setPosition(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'team.update.form.position_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                <div>
                                    <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                        {t('team.update.form.status_label')}
                                    </label>
                                    <select
                                        value={isActive}
                                        onChange={(e) =>
                                            setIsActive(Number(e.target.value))
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
                                <div>
                                    <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                        {t('team.update.form.order_label')}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={displayOrder}
                                        onChange={(e) =>
                                            setDisplayOrder(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder={t(
                                            'team.update.form.order_placeholder'
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('team.update.form.bio_label')}
                                </label>
                                <textarea
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'team.update.form.bio_placeholder'
                                    )}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('team.update.card_media')}
                        </h2>

                        <div>
                            <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                {t('team.update.form.avatar_label')}
                            </label>

                            <div className="file-upload-zone relative overflow-hidden flex justify-center items-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
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
                                    onChange={handleAvatarChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                                    accept="image/*"
                                />

                                {avatarPreview && (
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveAvatar();
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

                    {/* ACTIONS SUBMIT */}
                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/team-members')}
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
                                    {t('common.actions.save_changes')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
