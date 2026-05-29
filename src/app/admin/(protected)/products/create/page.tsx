'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiCategory, apiProduct, apiSpecification } from '@/src/services';
import { useTranslation } from 'react-i18next';
import { ProductSpecForm, VariantForm } from '@/src/types';

export default function CreateProductPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [productName, setProductName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<number>(1);

    const [categories, setCategories] = useState<any[]>([]);
    const [categorySearch, setCategorySearch] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const catDropdownRef = useRef<HTMLDivElement>(null);

    const [productImages, setProductImages] = useState<
        { file: File; preview: string }[]
    >([]);

    const [variants, setVariants] = useState<VariantForm[]>([
        {
            tempId: `tmp_${Date.now()}`,
            sku: '',
            variantName: '',
            price: '',
            initialStock: '',
            rawFile: null,
            previewUrl: null,
        },
    ]);

    const [isSpecsExpanded, setIsSpecsExpanded] = useState<boolean>(false);
    const [productSpecs, setProductSpecs] = useState<ProductSpecForm[]>([]);

    const [specSearch, setSpecSearch] = useState<string>('');
    const [fetchedSpecs, setFetchedSpecs] = useState<any[]>([]);
    const [activeSpecDropdown, setActiveSpecDropdown] = useState<string | null>(
        null
    );
    const specsContainerRef = useRef<HTMLDivElement>(null);

    const [isSpecModalOpen, setIsSpecModalOpen] = useState<boolean>(false);
    const [newSpecName, setNewSpecName] = useState<string>('');
    const [isCreatingSpec, setIsCreatingSpec] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                catDropdownRef.current &&
                !catDropdownRef.current.contains(event.target as Node)
            ) {
                setIsCatDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await apiCategory.getChildrenCategoriesForAdmin({
                    searchQuery: categorySearch,
                });
                setCategories(data);
            } catch (error) {
                console.error('Lỗi tải danh mục', error);
            }
        };
        const timer = setTimeout(() => {
            fetchCats();
        }, 300);
        return () => clearTimeout(timer);
    }, [categorySearch]);

    const handleAddProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setProductImages((prev) => [...prev, ...newImages]);
        e.target.value = '';
    };

    const handleRemoveProductImage = (indexToRemove: number) => {
        setProductImages((prev) =>
            prev.filter((_, idx) => idx !== indexToRemove)
        );
    };

    const handleSetMainImage = (indexToMain: number) => {
        if (indexToMain === 0) return;

        setProductImages((prev) => {
            const newImages = [...prev];
            const [selectedImg] = newImages.splice(indexToMain, 1);
            newImages.unshift(selectedImg);
            return newImages;
        });
    };

    const handleAddVariant = () => {
        setVariants([
            ...variants,
            {
                tempId: `tmp_${Date.now()}`,
                sku: '',
                variantName: '',
                price: '',
                initialStock: '',
                rawFile: null,
                previewUrl: null,
            },
        ]);
    };

    const handleRemoveVariant = (tempId: string) => {
        if (variants.length === 1) {
            toast.error(t('products.create.messages.variant_limit'));
            return;
        }
        setVariants(variants.filter((v) => v.tempId !== tempId));
    };

    const handleVariantChange = (
        tempId: string,
        field: keyof VariantForm,
        value: any
    ) => {
        setVariants((prevVariants) =>
            prevVariants.map((v) =>
                v.tempId === tempId ? { ...v, [field]: value } : v
            )
        );
    };

    const handleVariantImageChange = (
        tempId: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setVariants((prev) =>
                prev.map((v) =>
                    v.tempId === tempId
                        ? { ...v, rawFile: file, previewUrl: previewUrl }
                        : v
                )
            );
        }
    };

    useEffect(() => {
        if (!activeSpecDropdown) return;
        const fetchSpecs = async () => {
            try {
                const res = await apiSpecification.getSpecifications({
                    PageNumber: 1,
                    PageSize: 20,
                    SearchQuery: specSearch,
                });
                setFetchedSpecs(res.data?.data || []);
            } catch (error) {
                console.error('Lỗi tải specifications', error);
            }
        };
        const timer = setTimeout(fetchSpecs, 300);
        return () => clearTimeout(timer);
    }, [specSearch, activeSpecDropdown]);

    const handleAddSpecRow = () => {
        setProductSpecs([
            ...productSpecs,
            {
                tempId: `spec_${Date.now()}`,
                specificationId: null,
                specificationName: '',
                value: '',
            },
        ]);
    };

    const handleRemoveSpecRow = (tempId: string) => {
        setProductSpecs(productSpecs.filter((s) => s.tempId !== tempId));
    };

    const handleSelectSpec = (tempId: string, spec: any) => {
        if (
            productSpecs.some(
                (s) => s.specificationId === spec.id && s.tempId !== tempId
            )
        ) {
            toast.error(t('products.create.messages.spec_duplicate'));
            return;
        }
        setProductSpecs((prev) =>
            prev.map((s) =>
                s.tempId === tempId
                    ? {
                          ...s,
                          specificationId: spec.id,
                          specificationName: spec.name,
                      }
                    : s
            )
        );
        setActiveSpecDropdown(null);
        setSpecSearch('');
    };

    const handleSpecValueChange = (tempId: string, value: string) => {
        setProductSpecs((prev) =>
            prev.map((s) => (s.tempId === tempId ? { ...s, value } : s))
        );
    };

    const handleCreateNewSpecSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSpecName.trim()) return;
        setIsCreatingSpec(true);
        try {
            const res = await apiSpecification.createSpecification({
                name: newSpecName.trim(),
            });
            toast.success(t('products.create.messages.spec_created'));

            if (activeSpecDropdown && res.data) {
                setProductSpecs((prev) =>
                    prev.map((s) =>
                        s.tempId === activeSpecDropdown
                            ? {
                                  ...s,
                                  specificationId: res.data.id,
                                  specificationName: res.data.name,
                              }
                            : s
                    )
                );
            }

            setIsSpecModalOpen(false);
            setNewSpecName('');
            setActiveSpecDropdown(null);
        } catch (error: any) {
            toast.error(t('products.create.messages.spec_create_error'));
        } finally {
            setIsCreatingSpec(false);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent,
        isDraft: boolean = false
    ) => {
        e.preventDefault();
        if (!productName.trim())
            return toast.error(t('products.create.messages.val_name_req'));
        if (!selectedCategory)
            return toast.error(t('products.create.messages.val_cat_req'));
        if (
            variants.some(
                (v) => !v.sku || !v.variantName || !v.price || !v.initialStock
            )
        ) {
            return toast.error(t('products.create.messages.val_var_req'));
        }
        if (productImages.length === 0)
            return toast.error(t('products.create.messages.val_img_req'));

        const invalidSpecs = productSpecs.filter(
            (s) => s.specificationId !== null && !s.value.trim()
        );
        if (invalidSpecs.length > 0) {
            return toast.error(t('products.create.messages.val_spec_req'));
        }

        setIsSubmitting(true);
        const finalStatus = isDraft ? 0 : 1;

        try {
            const variantsWithFiles = variants.filter((v) => v.rawFile);
            const uploadPromises = variantsWithFiles.map(async (v) => {
                const formData = new FormData();
                formData.append('File', v.rawFile!);
                formData.append('TempId', v.tempId);
                const res = await apiProduct.uploadTempVariantImage(formData);
                console.log('variant:', res);

                return res;
            });
            const uploadedVariantImages = await Promise.all(uploadPromises);
            console.log('variant f:', uploadedVariantImages);

            const finalVariants = variants.map((v) => {
                const uploadedImg = uploadedVariantImages.find(
                    (img) => img.data?.tempId === v.tempId
                );

                return {
                    sku: v.sku,
                    variantName: v.variantName,
                    price: Number(v.price),
                    initialStock: Number(v.initialStock),
                    imageUrl: uploadedImg ? uploadedImg.data.url : null,
                };
            });

            const productPayload = {
                categoryId: selectedCategory.id,
                name: productName,
                description: description,
                status: finalStatus,
                variants: finalVariants,
            };

            const createdProduct =
                await apiProduct.createProduct(productPayload);

            console.log('create pro res:', createdProduct);

            if (createdProduct && createdProduct.data.id) {
                const productId = createdProduct.data.id;

                if (productImages.length > 0) {
                    const formData = new FormData();
                    productImages.forEach((p) =>
                        formData.append('images', p.file)
                    );
                    await apiProduct.uploadProductImages(productId, formData);
                }

                const validSpecsPayload = productSpecs
                    .filter(
                        (s) =>
                            s.specificationId !== null && s.value.trim() !== ''
                    )
                    .map((s) => ({
                        specificationId: s.specificationId,
                        value: s.value.trim(),
                    }));

                if (validSpecsPayload.length > 0) {
                    await apiProduct.updateProductSpecifications(
                        productId,
                        validSpecsPayload
                    );
                }
            }

            toast.success(t('products.create.messages.create_success'));
            router.push('/admin/products');
        } catch (error: any) {
            console.error(error);
            toast.error(t('products.create.messages.create_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('admin:dashboard'), href: '/admin' },
        { name: t('products.title'), href: '/admin/products' },
        { name: t('products.create.title') },
    ];

    return (
        <>
            <Header title="Thêm Sản Phẩm Mới" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
                <form
                    className="space-y-6"
                    onSubmit={(e) => handleSubmit(e, false)}
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                            {t('products.create.basic_info.title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('products.create.basic_info.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder={t(
                                        'products.create.basic_info.name_placeholder'
                                    )}
                                    required
                                />
                            </div>

                            <div className="relative" ref={catDropdownRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t(
                                        'products.create.basic_info.category_label'
                                    )}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white"
                                    onClick={() => setIsCatDropdownOpen(true)}
                                >
                                    <span
                                        className={
                                            selectedCategory
                                                ? 'text-gray-900'
                                                : 'text-gray-400'
                                        }
                                    >
                                        {selectedCategory
                                            ? `${selectedCategory.name} (${selectedCategory.parentName})`
                                            : t(
                                                  'products.create.basic_info.category_placeholder'
                                              )}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-sm"></i>
                                </div>

                                {isCatDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                                            <div className="relative">
                                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                    placeholder={t(
                                                        'products.create.basic_info.category_search'
                                                    )}
                                                    value={categorySearch}
                                                    onChange={(e) =>
                                                        setCategorySearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <ul className="max-h-60 overflow-y-auto">
                                            {categories.length === 0 ? (
                                                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    {t(
                                                        'products.create.basic_info.category_not_found'
                                                    )}
                                                </li>
                                            ) : (
                                                categories.map((cat) => (
                                                    <li
                                                        key={cat.id}
                                                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                cat
                                                            );
                                                            setIsCatDropdownOpen(
                                                                false
                                                            );
                                                            setCategorySearch(
                                                                ''
                                                            );
                                                        }}
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {cat.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {t(
                                                                'products.create.basic_info.category_parent'
                                                            )}
                                                            {cat.parentName}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t(
                                        'products.create.basic_info.status_label'
                                    )}
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(Number(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value={1}>
                                        {t(
                                            'products.create.basic_info.status_active'
                                        )}
                                    </option>
                                    <option value={0}>
                                        {t(
                                            'products.create.basic_info.status_draft'
                                        )}
                                    </option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('products.create.basic_info.desc_label')}
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder={t(
                                        'products.create.basic_info.desc_placeholder'
                                    )}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {t('products.create.gallery.title')}{' '}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('products.create.gallery.subtitle')}
                                </p>
                            </div>

                            <label className="shrink-0 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg border border-blue-200 cursor-pointer transition-colors flex items-center gap-2 shadow-sm text-sm">
                                <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                                {t('products.create.gallery.upload_btn')}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAddProductImages}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Array.from({
                                length: Math.max(6, productImages.length),
                            }).map((_, idx) => {
                                const isUploaded = idx < productImages.length;

                                if (isUploaded) {
                                    const imgObj = productImages[idx];
                                    return (
                                        <div
                                            key={idx}
                                            className={`aspect-square relative rounded-xl border-2 overflow-hidden group transition-all ${
                                                idx === 0
                                                    ? 'border-blue-500 shadow-md'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <img
                                                src={imgObj.preview}
                                                alt={`Preview ${idx}`}
                                                className="w-full h-full object-cover"
                                            />

                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveProductImage(
                                                                idx
                                                            )
                                                        }
                                                        className="w-7 h-7 bg-white text-red-500 rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                                                        title="Xóa ảnh"
                                                    >
                                                        <i className="fa-solid fa-trash-can text-sm"></i>
                                                    </button>
                                                </div>

                                                {idx !== 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSetMainImage(
                                                                idx
                                                            )
                                                        }
                                                        className="w-full py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors shadow-sm"
                                                    >
                                                        {t(
                                                            'products.create.gallery.set_main_btn'
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/95 text-white text-[10px] text-center py-1.5 font-bold uppercase tracking-wider">
                                                    {t(
                                                        'products.create.gallery.main_image_label'
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={`placeholder-${idx}`}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300"
                                    >
                                        <i className="fa-regular fa-image text-3xl opacity-50"></i>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* VARIANT */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {t('products.create.variants.title')}{' '}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {t('products.create.variants.subtitle')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm"
                            >
                                <i className="fa-solid fa-plus"></i>
                                {t('products.create.variants.add_btn')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div
                                    key={variant.tempId}
                                    className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 relative group"
                                >
                                    <div className="shrink-0">
                                        <label className="w-24 h-24 flex flex-col items-center justify-center border border-gray-300 rounded-lg bg-white overflow-hidden cursor-pointer hover:border-blue-500 transition relative">
                                            {variant.previewUrl ? (
                                                <img
                                                    src={variant.previewUrl}
                                                    className="w-full h-full object-cover"
                                                    alt="Variant"
                                                />
                                            ) : (
                                                <>
                                                    <i className="fa-regular fa-image text-gray-400 text-xl mb-1"></i>
                                                    <span className="text-[10px] text-gray-500">
                                                        {t(
                                                            'products.create.variants.image_placeholder'
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleVariantImageChange(
                                                        variant.tempId,
                                                        e
                                                    )
                                                }
                                            />
                                        </label>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                                                {t(
                                                    'products.create.variants.name_label'
                                                )}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t(
                                                    'products.create.variants.name_placeholder'
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                                                value={variant.variantName}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.tempId,
                                                        'variantName',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                                                {t(
                                                    'products.create.variants.sku_label'
                                                )}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t(
                                                    'products.create.variants.sku_placeholder'
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.tempId,
                                                        'sku',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                                                {t(
                                                    'products.create.variants.price_label'
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder={t(
                                                    'products.create.variants.price_placeholder'
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                                                value={variant.price}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.tempId,
                                                        'price',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                                                {t(
                                                    'products.create.variants.stock_label'
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder={t(
                                                    'products.create.variants.stock_placeholder'
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                                                value={variant.initialStock}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.tempId,
                                                        'initialStock',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveVariant(variant.tempId)
                                        }
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PRODUCT SPEC VALUES */}
                    <div
                        className="bg-white rounded-xl border border-gray-200 shadow-sm"
                        ref={specsContainerRef}
                    >
                        <div
                            className={`p-6 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-xl ${!isSpecsExpanded ? 'rounded-b-xl' : ''}`}
                            onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {t('products.create.specs.title')}
                                </h2>
                                <p className="text-sm text-gray-500 font-normal mt-1">
                                    {t('products.create.specs.subtitle')}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <i
                                    className={`fa-solid fa-chevron-down text-gray-500 transition-transform duration-300 ${isSpecsExpanded ? 'rotate-180' : ''}`}
                                ></i>
                            </div>
                        </div>

                        {/* Accordion Body */}
                        {isSpecsExpanded && (
                            <div className="p-6 border-t border-gray-200">
                                {productSpecs.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <i className="fa-solid fa-list-check text-4xl text-gray-300 mb-3"></i>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {t(
                                                'products.create.specs.empty_state'
                                            )}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleAddSpecRow}
                                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm"
                                        >
                                            <i className="fa-solid fa-plus mr-2"></i>
                                            {t(
                                                'products.create.specs.add_first_btn'
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase tracking-wide">
                                            <div className="col-span-4">
                                                {t(
                                                    'products.create.specs.col_name'
                                                )}
                                            </div>
                                            <div className="col-span-7">
                                                {t(
                                                    'products.create.specs.col_value'
                                                )}
                                            </div>
                                            <div className="col-span-1 text-center">
                                                {t(
                                                    'products.create.specs.col_action'
                                                )}
                                            </div>
                                        </div>

                                        {productSpecs.map((spec) => (
                                            <div
                                                key={spec.tempId}
                                                className={`flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-white p-4 md:p-0 border border-gray-200 md:border-0 rounded-lg relative ${activeSpecDropdown === spec.tempId ? 'z-50' : 'z-10'}`}
                                            >
                                                <div className="w-full md:col-span-4 relative">
                                                    <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                                                        {t(
                                                            'products.create.specs.col_name'
                                                        )}
                                                    </label>
                                                    <div
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center text-sm"
                                                        onClick={() => {
                                                            setActiveSpecDropdown(
                                                                activeSpecDropdown ===
                                                                    spec.tempId
                                                                    ? null
                                                                    : spec.tempId
                                                            );
                                                            setSpecSearch('');
                                                        }}
                                                    >
                                                        <span
                                                            className={
                                                                spec.specificationName
                                                                    ? 'text-gray-800'
                                                                    : 'text-gray-400'
                                                            }
                                                        >
                                                            {spec.specificationName ||
                                                                t(
                                                                    'products.create.specs.name_placeholder'
                                                                )}
                                                        </span>
                                                        <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                                    </div>

                                                    {/* Dropdown Box */}
                                                    {activeSpecDropdown ===
                                                        spec.tempId && (
                                                        <div className="absolute z-40 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                                                                    placeholder={t(
                                                                        'products.create.specs.search_placeholder'
                                                                    )}
                                                                    value={
                                                                        specSearch
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSpecSearch(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <ul className="max-h-48 overflow-y-auto">
                                                                {fetchedSpecs.length ===
                                                                0 ? (
                                                                    <li className="px-3 py-4 text-xs text-gray-500 text-center">
                                                                        {t(
                                                                            'products.create.specs.not_found'
                                                                        )}
                                                                    </li>
                                                                ) : (
                                                                    fetchedSpecs.map(
                                                                        (
                                                                            fSpec
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    fSpec.id
                                                                                }
                                                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                                                                                onClick={() =>
                                                                                    handleSelectSpec(
                                                                                        spec.tempId,
                                                                                        fSpec
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    fSpec.name
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )
                                                                )}
                                                            </ul>
                                                            <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setIsSpecModalOpen(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="text-xs text-blue-600 font-semibold hover:underline w-full py-1"
                                                                >
                                                                    <i className="fa-solid fa-plus mr-1"></i>{' '}
                                                                    {t(
                                                                        'products.create.specs.create_new_btn'
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full md:col-span-7">
                                                    <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                                                        {t(
                                                            'products.create.specs.col_value'
                                                        )}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={t(
                                                            'products.create.specs.value_placeholder'
                                                        )}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                                                        value={spec.value}
                                                        onChange={(e) =>
                                                            handleSpecValueChange(
                                                                spec.tempId,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            !spec.specificationId
                                                        }
                                                    />
                                                </div>

                                                <div className="w-full md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveSpecRow(
                                                                spec.tempId
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        title={t(
                                                            'products.create.specs.col_action'
                                                        )}
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                onClick={handleAddSpecRow}
                                                className="px-4 py-2 bg-white border border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2"
                                            >
                                                <i className="fa-solid fa-plus text-xs"></i>{' '}
                                                {t(
                                                    'products.create.specs.add_row_btn'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-70"
                        >
                            {t('products.create.actions.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-70"
                        >
                            {t('products.create.actions.save_draft')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting && (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            )}
                            {isSubmitting
                                ? t('products.create.actions.saving')
                                : t('products.create.actions.save')}
                        </button>
                    </div>
                </form>
            </div>

            {isSpecModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {t('products.create.spec_modal.title')}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsSpecModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateNewSpecSubmit}>
                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('products.create.spec_modal.name_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSpecName}
                                    onChange={(e) =>
                                        setNewSpecName(e.target.value)
                                    }
                                    placeholder={t(
                                        'products.create.spec_modal.name_placeholder'
                                    )}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                    autoFocus
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    <i className="fa-solid fa-circle-info mr-1"></i>{' '}
                                    {t('products.create.spec_modal.hint')}
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSpecModalOpen(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 text-sm"
                                >
                                    {t('products.create.spec_modal.cancel_btn')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingSpec}
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2 text-sm"
                                >
                                    {isCreatingSpec ? (
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    ) : (
                                        t(
                                            'products.create.spec_modal.submit_btn'
                                        )
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
