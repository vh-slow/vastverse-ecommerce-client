'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiCategory } from '@/src/services';
import { getImageUrl } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';

export default function UpdateCategoryPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();
    const params = useParams();
    const categoryId = params?.id as string;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [categoryName, setCategoryName] = useState<string>('');

    const [parentCategories, setParentCategories] = useState<any[]>([]);
    const [parentSearch, setParentSearch] = useState<string>('');
    const [selectedParent, setSelectedParent] = useState<any | null>(null);
    const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
    const parentDropdownRef = useRef<HTMLDivElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!categoryId) return;

        const loadCategoryDetail = async () => {
            try {
                const response =
                    await apiCategory.getCategoriesDetailForAdmin(categoryId);
                console.log(response);
                setCategoryName(response.name);

                if (response.parentId) {
                    setSelectedParent({
                        id: response.parentId,
                        name:
                            response.parentName ||
                            `Danh mục #${response.parentId}`,
                    });
                }

                if (response.image) {
                    setImagePreview(getImageUrl(response.image));
                }
            } catch (error) {
                console.error(error);
                toast.error(t('categories.update.messages.load_error'));
                router.push('/admin/categories');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategoryDetail();
    }, [categoryId, router, t]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                parentDropdownRef.current &&
                !parentDropdownRef.current.contains(event.target as Node)
            ) {
                setIsParentDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchParentCats = async () => {
            try {
                const data = await apiCategory.getPgetParentCategoriesForAdmin({
                    searchQuery: parentSearch,
                });
                setParentCategories(data || []);
            } catch (error) {
                console.error(
                    t('categories.update.messages.load_parent_error'),
                    error
                );
            }
        };
        const timer = setTimeout(fetchParentCats, 300);
        return () => clearTimeout(timer);
    }, [parentSearch, t]);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            toast.error(t('categories.update.messages.validation_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('Name', categoryName.trim());

            if (selectedParent && selectedParent.id) {
                formData.append('ParentId', selectedParent.id.toString());
            }

            if (imageFile) {
                formData.append('ImageFile', imageFile);
            }

            await apiCategory.updateCategory(categoryId, formData);

            toast.success(t('categories.update.messages.update_success'));
            router.push('/admin/categories');
        } catch (error: any) {
            console.error('Update category error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('categories.update.messages.update_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('categories.title'), href: '/admin/categories' },
        { name: t('categories.update.title') },
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
                title={t('categories.update.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('categories.update.card_title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="category-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t('categories.update.form.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="category-name"
                                    value={categoryName}
                                    onChange={(e) =>
                                        setCategoryName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'categories.update.form.name_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            {/* Dropdown Category Cha */}
                            <div
                                className="md:col-span-2 relative"
                                ref={parentDropdownRef}
                            >
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    {t('categories.update.form.parent_label')}
                                </label>
                                <div
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white min-h-[42px]"
                                    onClick={() =>
                                        setIsParentDropdownOpen(
                                            !isParentDropdownOpen
                                        )
                                    }
                                >
                                    <span
                                        className={`truncate pr-4 ${
                                            selectedParent
                                                ? 'text-gray-900'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {selectedParent
                                            ? selectedParent.name
                                            : t(
                                                  'categories.update.form.parent_placeholder'
                                              )}
                                    </span>
                                    <div className="flex-shrink-0 flex items-center">
                                        {selectedParent && (
                                            <i
                                                className="fa-solid fa-xmark text-gray-400 hover:text-red-500 mr-3 px-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedParent(null);
                                                }}
                                                title="Bỏ chọn"
                                            ></i>
                                        )}
                                        <i className="fa-solid fa-chevron-down text-gray-400 text-sm"></i>
                                    </div>
                                </div>

                                {isParentDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                                            <div className="relative">
                                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                    placeholder={t(
                                                        'categories.update.form.parent_search'
                                                    )}
                                                    value={parentSearch}
                                                    onChange={(e) =>
                                                        setParentSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <ul className="max-h-60 overflow-y-auto">
                                            <li
                                                className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 text-blue-600 font-medium"
                                                onClick={() => {
                                                    setSelectedParent(null);
                                                    setIsParentDropdownOpen(
                                                        false
                                                    );
                                                    setParentSearch('');
                                                }}
                                            >
                                                -- Không chọn (Danh mục gốc) --
                                            </li>

                                            {parentCategories.length === 0 ? (
                                                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    {t(
                                                        'categories.update.form.parent_not_found'
                                                    )}
                                                </li>
                                            ) : (
                                                parentCategories.map((cat) => (
                                                    <li
                                                        key={cat.id}
                                                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                                                        onClick={() => {
                                                            setSelectedParent(
                                                                cat
                                                            );
                                                            setIsParentDropdownOpen(
                                                                false
                                                            );
                                                            setParentSearch('');
                                                        }}
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {cat.name}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {t('categories.update.form.image_label')}
                            </label>
                            <div
                                id="image-upload-zone"
                                className="file-upload-zone relative overflow-hidden flex justify-center items-center min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-contain p-2 z-0"
                                    />
                                ) : (
                                    <div
                                        id="upload-prompt"
                                        className="text-center z-10 pointer-events-none"
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400"></i>
                                        <p className="mt-2 text-sm text-gray-600">
                                            <span className="font-semibold text-blue-600">
                                                {t('common.upload.click')}
                                            </span>{' '}
                                            {t('common.upload.drag')}
                                        </p>
                                    </div>
                                )}

                                <input
                                    id="image-input"
                                    type="file"
                                    onChange={handleImageChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                                    accept="image/*"
                                />

                                {imagePreview && (
                                    <div className="absolute top-2 right-2 z-30">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage();
                                            }}
                                            className="w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions (Sử dụng key chung common.actions) */}
                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/categories')}
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
