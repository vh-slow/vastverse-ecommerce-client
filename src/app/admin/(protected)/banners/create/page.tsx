'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiBanner } from '@/src/services/banner';
import { apiProduct } from '@/src/services';
import { getImageUrl } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';

export default function CreateBannerPage() {
    const { t } = useTranslation(['admin', 'common']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [placement, setPlacement] = useState<number>(1);
    const [displayOrder, setDisplayOrder] = useState<string>('1');
    const [isActive, setIsActive] = useState<number>(1);

    const [title, setTitle] = useState<string>('');
    const [subtitle, setSubtitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [buttonText, setButtonText] = useState<string>('');

    const [products, setProducts] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState<string>('');
    const [debouncedProductSearch, setDebouncedProductSearch] =
        useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const productDropdownRef = useRef<HTMLDivElement>(null);

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    useEffect(() => {
        setMediaFile(null);
        setMediaPreview(null);
    }, [placement]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                productDropdownRef.current &&
                !productDropdownRef.current.contains(event.target as Node)
            ) {
                setIsProductDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedProductSearch(productSearch);
        }, 500);
        return () => clearTimeout(timerId);
    }, [productSearch]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {
                    PageNumber: 1,
                    PageSize: 10,
                    SearchQuery: debouncedProductSearch,
                    Status: 1,
                };
                const res =
                    await apiProduct.getProductsPaginationForAdmin(params);
                console.log(res);
                setProducts(res?.data || []);
            } catch (error) {
                console.error('Lỗi tải sản phẩm: ', error);
            }
        };
        fetchProducts();
    }, [debouncedProductSearch]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validations
        if (!title.trim() || !subtitle.trim() || !buttonText.trim()) {
            toast.error(t('banners.create.messages.val_info_req'));
            return;
        }

        if (!selectedProduct) {
            toast.error(t('banners.create.messages.val_link_req'));
            return;
        }

        if (!mediaFile) {
            toast.error(t('banners.create.messages.val_media_req'));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Text fields
            formData.append('Placement', placement.toString());
            formData.append('DisplayOrder', displayOrder);
            formData.append('IsActive', isActive === 1 ? 'true' : 'false');
            formData.append('Title', title.trim());
            formData.append('Subtitle', subtitle.trim());
            formData.append('Description', description.trim());
            formData.append('ButtonText', buttonText.trim());

            // Xử lý thông minh LinkUrl
            formData.append('LinkUrl', `/products/${selectedProduct.slug}`);

            // Xử lý Media theo Placement
            if (placement === 1) {
                formData.append('ImageFile', mediaFile);
                // Backend có thể tự hiểu VideoFile = null
            } else {
                formData.append('VideoFile', mediaFile);
                // Backend có thể tự hiểu ImageFile = null
            }

            await apiBanner.createBanner(formData);

            toast.success(t('banners.create.messages.create_success'));
            router.push('/admin/banners');
        } catch (error: any) {
            console.error('Create banner error:', error);
            toast.error(
                error.response?.data?.message ||
                    t('banners.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('banners.title'), href: '/admin/banners' },
        { name: t('banners.create.title') },
    ];

    return (
        <>
            <Header
                title={t('banners.create.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* BANNER */}
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('banners.create.card_info')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('banners.create.form.placement_label')}
                                </label>
                                <select
                                    value={placement}
                                    onChange={(e) =>
                                        setPlacement(Number(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                                >
                                    <option value={1}>
                                        {t(
                                            'banners.create.form.placement_home'
                                        )}
                                    </option>
                                    <option value={2}>
                                        {t(
                                            'banners.create.form.placement_portfolio'
                                        )}
                                    </option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                        {t('banners.create.form.status_label')}
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
                                        {t('banners.create.form.order_label')}{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={displayOrder}
                                        onChange={(e) =>
                                            setDisplayOrder(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder={t(
                                            'banners.create.form.order_placeholder'
                                        )}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('banners.create.form.title_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'banners.create.form.title_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('banners.create.form.subtitle_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'banners.create.form.subtitle_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('banners.create.form.button_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={buttonText}
                                    onChange={(e) =>
                                        setButtonText(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'banners.create.form.button_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('banners.create.form.desc_label')}
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'banners.create.form.desc_placeholder'
                                    )}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Link */}
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('banners.create.card_link')}
                        </h2>

                        <div className="relative" ref={productDropdownRef}>
                            <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                {t('banners.create.form.product_label')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white min-h-[42px]"
                                onClick={() =>
                                    setIsProductDropdownOpen(
                                        !isProductDropdownOpen
                                    )
                                }
                            >
                                <span
                                    className={`truncate pr-4 ${selectedProduct ? 'text-gray-900' : 'text-gray-400'}`}
                                >
                                    {selectedProduct
                                        ? selectedProduct.name
                                        : t(
                                              'banners.create.form.product_placeholder'
                                          )}
                                </span>
                                <div className="flex-shrink-0 flex items-center">
                                    {selectedProduct && (
                                        <i
                                            className="fa-solid fa-xmark text-gray-400 hover:text-red-500 mr-3 px-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(null);
                                            }}
                                            title="Bỏ chọn"
                                        ></i>
                                    )}
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-sm"></i>
                                </div>
                            </div>

                            {isProductDropdownOpen && (
                                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                                        <div className="relative">
                                            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                            <input
                                                type="text"
                                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                placeholder={t(
                                                    'banners.create.form.product_search'
                                                )}
                                                value={productSearch}
                                                onChange={(e) =>
                                                    setProductSearch(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <ul className="max-h-72 overflow-y-auto">
                                        {products.length === 0 ? (
                                            <li className="px-4 py-4 text-sm text-gray-500 text-center">
                                                {t(
                                                    'banners.create.form.product_not_found'
                                                )}
                                            </li>
                                        ) : (
                                            products.map((prod) => (
                                                <li
                                                    key={prod.id}
                                                    className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3"
                                                    onClick={() => {
                                                        setSelectedProduct(
                                                            prod
                                                        );
                                                        setIsProductDropdownOpen(
                                                            false
                                                        );
                                                        setProductSearch('');
                                                    }}
                                                >
                                                    <img
                                                        src={getImageUrl(
                                                            prod.mainImage
                                                        )}
                                                        alt={prod.name}
                                                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/40x40/f1f5f9/334155?text=Img';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {prod.name}
                                                        </p>
                                                        <p className="text-xs text-blue-600 mt-0.5">
                                                            /products/
                                                            {prod.slug}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MEDIA UPLOAD */}
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('banners.create.card_media')}
                        </h2>

                        <div>
                            <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                {placement === 1
                                    ? t('banners.create.media.image_label')
                                    : t(
                                          'banners.create.media.video_label'
                                      )}{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="file-upload-zone relative overflow-hidden flex justify-center items-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                {mediaPreview ? (
                                    <>
                                        {placement === 1 ? (
                                            <img
                                                src={mediaPreview}
                                                alt="Banner Preview"
                                                className="absolute inset-0 w-full h-full object-contain p-2 z-0 rounded-xl"
                                            />
                                        ) : (
                                            <video
                                                src={mediaPreview}
                                                controls
                                                className="absolute inset-0 w-full h-full object-contain p-2 z-0 rounded-xl bg-black"
                                            />
                                        )}
                                    </>
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
                                            {placement === 1
                                                ? t(
                                                      'banners.create.media.image_hint'
                                                  )
                                                : t(
                                                      'banners.create.media.video_hint'
                                                  )}
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleMediaChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                                    accept={
                                        placement === 1 ? 'image/*' : 'video/*'
                                    }
                                    required={!mediaPreview}
                                />

                                {mediaPreview && (
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveMedia();
                                            }}
                                            className="w-10 h-10 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                            title={t('common.actions.delete')}
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
                            onClick={() => router.push('/admin/banners')}
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
