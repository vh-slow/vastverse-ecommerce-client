'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiStockIn } from '@/src/services/stockIn';
import { apiSupplier } from '@/src/services/supplier';
import { apiProduct, BASE_URL } from '@/src/services';
import { useTranslation } from 'react-i18next';
import { formatCurrency, getImageUrl } from '@/src/utils/formatters';

interface StockInRow {
    localId: string;
    selectedProduct: any | null;
    selectedVariantId: number | '';
    quantity: number;
    importPrice: number;
}

export default function CreateStockInPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [note, setNote] = useState<string>('');
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [supplierSearch, setSupplierSearch] = useState<string>('');
    const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const supplierDropdownRef = useRef<HTMLDivElement>(null);

    const [items, setItems] = useState<StockInRow[]>([]);

    const [products, setProducts] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState<string>('');
    const [debouncedProductSearch, setDebouncedProductSearch] =
        useState<string>('');
    const [activeDropdownRowId, setActiveDropdownRowId] = useState<
        string | null
    >(null);

    const productDropdownRef = useRef<HTMLTableDataCellElement>(null);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const res = await apiSupplier.getSuppliersPaginationForAdmin({
                    PageSize: 50,
                    Status: 1,
                    SearchQuery: supplierSearch,
                });
                setSuppliers(res?.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        const timerId = setTimeout(loadSuppliers, 300);
        return () => clearTimeout(timerId);
    }, [supplierSearch]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedProductSearch(productSearch);
        }, 500);
        return () => clearTimeout(timerId);
    }, [productSearch]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiProduct.getProductsPaginationForAdmin({
                    PageSize: 10,
                    SearchQuery: debouncedProductSearch,
                    Status: 1,
                });
                setProducts(res?.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, [debouncedProductSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                supplierDropdownRef.current &&
                !supplierDropdownRef.current.contains(event.target as Node)
            ) {
                setIsSupplierDropdownOpen(false);
            }
            if (
                productDropdownRef.current &&
                !productDropdownRef.current.contains(event.target as Node)
            ) {
                setActiveDropdownRowId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddRow = () => {
        const newRow: StockInRow = {
            localId: Math.random().toString(36).substring(7),
            selectedProduct: null,
            selectedVariantId: '',
            quantity: 1,
            importPrice: 0,
        };
        setItems([...items, newRow]);
    };

    const handleRemoveRow = (localId: string) => {
        setItems(items.filter((i) => i.localId !== localId));
    };

    const handleUpdateRowField = (
        localId: string,
        field: keyof StockInRow,
        value: any
    ) => {
        setItems(
            items.map((i) => {
                if (i.localId === localId) {
                    const updatedRow = { ...i, [field]: value };
                    if (field === 'selectedProduct') {
                        updatedRow.selectedVariantId = '';
                    }
                    return updatedRow;
                }
                return i;
            })
        );
    };

    const calculateGrandTotal = () => {
        return items.reduce(
            (sum, item) => sum + item.quantity * item.importPrice,
            0
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSupplier) {
            toast.error(t('stock_ins.create.messages.val_info_req'));
            return;
        }

        if (items.length === 0) {
            toast.error(t('stock_ins.create.messages.val_items_req'));
            return;
        }

        const isAnyRowIncomplete = items.some((i) => !i.selectedVariantId);
        if (isAnyRowIncomplete) {
            toast.error(t('stock_ins.create.messages.val_draft_req'));
            return;
        }

        const isAnyRowInvalid = items.some(
            (i) => i.quantity <= 0 || i.importPrice < 0
        );
        if (isAnyRowInvalid) {
            toast.error(t('stock_ins.create.messages.val_draft_invalid'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                supplierId: selectedSupplier.id,
                note: note.trim(),
                items: items.map((i) => ({
                    productVariantId: Number(i.selectedVariantId),
                    quantity: Number(i.quantity),
                    importPrice: Number(i.importPrice),
                })),
            };

            await apiStockIn.createStockIn(payload);

            toast.success(t('stock_ins.create.messages.create_success'));
            router.push('/admin/stock-ins');
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    t('stock_ins.create.messages.create_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('stock_ins.title'), href: '/admin/stock-ins' },
        { name: t('stock_ins.create.title') },
    ];

    return (
        <>
            <Header
                title={t('stock_ins.create.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            {t('stock_ins.create.card_info')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="relative z-30"
                                ref={supplierDropdownRef}
                            >
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('stock_ins.create.form.supplier_label')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className="border border-gray-300 rounded-lg shadow-sm h-10 text-sm flex items-center justify-between px-3 cursor-pointer bg-white"
                                    onClick={() =>
                                        setIsSupplierDropdownOpen(
                                            !isSupplierDropdownOpen
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {selectedSupplier ? (
                                            <>
                                                <img
                                                    src={getImageUrl(
                                                        selectedSupplier.logoUrl
                                                    )}
                                                    alt="Logo"
                                                    className="w-5 h-5 object-contain rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://placehold.co/20x20/f1f5f9/334155?text=S';
                                                    }}
                                                />
                                                <span className="text-gray-700 truncate">
                                                    {selectedSupplier.name}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">
                                                {t(
                                                    'stock_ins.create.form.supplier_placeholder'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                </div>

                                {isSupplierDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                                            <div className="relative">
                                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
                                                    placeholder={t(
                                                        'stock_ins.create.form.supplier_search'
                                                    )}
                                                    value={supplierSearch}
                                                    onChange={(e) =>
                                                        setSupplierSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <ul className="max-h-60 overflow-y-auto">
                                            {suppliers.length === 0 ? (
                                                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    {t(
                                                        'stock_ins.create.form.supplier_not_found'
                                                    )}
                                                </li>
                                            ) : (
                                                suppliers.map((sup) => (
                                                    <li
                                                        key={sup.id}
                                                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3"
                                                        onClick={() => {
                                                            setSelectedSupplier(
                                                                sup
                                                            );
                                                            setIsSupplierDropdownOpen(
                                                                false
                                                            );
                                                            setSupplierSearch(
                                                                ''
                                                            );
                                                        }}
                                                    >
                                                        <img
                                                            src={getImageUrl(
                                                                sup.logoUrl
                                                            )}
                                                            alt={sup.name}
                                                            className="w-6 h-6 object-contain rounded"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://placehold.co/24x24/f1f5f9/334155?text=S';
                                                            }}
                                                        />
                                                        <span className="font-medium text-gray-800">
                                                            {sup.name}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label mb-2 block text-sm font-medium text-gray-700">
                                    {t('stock_ins.create.form.note_label')}
                                </label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-10 text-sm outline-none focus:border-blue-500 shadow-sm"
                                    placeholder={t(
                                        'stock_ins.create.form.note_placeholder'
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {t('stock_ins.create.card_items')}
                            </h2>
                            {items.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="px-3 py-1.5 bg-white border border-dashed border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                                >
                                    <i className="fa-solid fa-plus text-gray-500"></i>{' '}
                                    {t('stock_ins.create.form.btn_add_row')}
                                </button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <i className="fa-solid fa-list-ul text-4xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500 text-sm mb-4">
                                    {t('stock_ins.create.item_table.empty')}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
                                >
                                    <i className="fa-solid fa-plus text-gray-500"></i>{' '}
                                    {t('stock_ins.create.form.btn_add_first')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-xl overflow-visible">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 uppercase text-xs">
                                                <th className="p-4 text-left font-semibold text-gray-600 w-1/3">
                                                    {t(
                                                        'stock_ins.create.item_table.product'
                                                    )}
                                                </th>
                                                <th className="p-4 text-left font-semibold text-gray-600">
                                                    {t(
                                                        'stock_ins.create.item_table.variant'
                                                    )}
                                                </th>
                                                <th className="p-4 text-center font-semibold text-gray-600 w-32">
                                                    {t(
                                                        'stock_ins.create.item_table.quantity'
                                                    )}
                                                </th>
                                                <th className="p-4 text-right font-semibold text-gray-600 w-40">
                                                    {t(
                                                        'stock_ins.create.item_table.price'
                                                    )}
                                                </th>
                                                <th className="p-4 text-right font-semibold text-gray-600 w-40">
                                                    {t(
                                                        'stock_ins.create.item_table.subtotal'
                                                    )}
                                                </th>
                                                <th className="p-4 text-center font-semibold text-gray-600 w-16">
                                                    XÓA
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {items.map((item) => (
                                                <tr
                                                    key={item.localId}
                                                    className="hover:bg-gray-50/50 transition-colors group"
                                                >
                                                    <td
                                                        className="p-3 relative"
                                                        ref={
                                                            activeDropdownRowId ===
                                                            item.localId
                                                                ? productDropdownRef
                                                                : null
                                                        }
                                                    >
                                                        <div
                                                            className="border border-gray-300 rounded-md shadow-sm h-10 text-sm flex items-center justify-between px-3 cursor-pointer bg-white"
                                                            onClick={() => {
                                                                setActiveDropdownRowId(
                                                                    activeDropdownRowId ===
                                                                        item.localId
                                                                        ? null
                                                                        : item.localId
                                                                );
                                                                setProductSearch(
                                                                    ''
                                                                );
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                {item.selectedProduct ? (
                                                                    <span className="text-gray-800 truncate">
                                                                        {
                                                                            item
                                                                                .selectedProduct
                                                                                .name
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        {t(
                                                                            'stock_ins.create.form.product_search'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <i className="fa-solid fa-chevron-down text-gray-400 text-xs ml-2"></i>
                                                        </div>

                                                        {activeDropdownRowId ===
                                                            item.localId && (
                                                            <div className="absolute z-50 mt-1 w-full min-w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden left-3">
                                                                <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                                    <div className="relative">
                                                                        <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
                                                                            placeholder={t(
                                                                                'stock_ins.create.form.product_search'
                                                                            )}
                                                                            value={
                                                                                productSearch
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setProductSearch(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            autoFocus
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <ul className="max-h-60 overflow-y-auto">
                                                                    {products.length ===
                                                                    0 ? (
                                                                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                                                            {t(
                                                                                'stock_ins.create.form.product_not_found'
                                                                            )}
                                                                        </li>
                                                                    ) : (
                                                                        products.map(
                                                                            (
                                                                                prod
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        prod.id
                                                                                    }
                                                                                    className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3"
                                                                                    onClick={() => {
                                                                                        handleUpdateRowField(
                                                                                            item.localId,
                                                                                            'selectedProduct',
                                                                                            prod
                                                                                        );
                                                                                        setActiveDropdownRowId(
                                                                                            null
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        src={`${BASE_URL}${prod.mainImage}`}
                                                                                        alt={
                                                                                            prod.name
                                                                                        }
                                                                                        className="w-8 h-8 object-cover rounded border border-gray-200 bg-white shrink-0"
                                                                                        onError={(
                                                                                            e
                                                                                        ) => {
                                                                                            e.currentTarget.src =
                                                                                                'https://placehold.co/32x32/f1f5f9/334155?text=P';
                                                                                        }}
                                                                                    />
                                                                                    <span className="font-semibold text-gray-800">
                                                                                        {
                                                                                            prod.name
                                                                                        }
                                                                                    </span>
                                                                                </li>
                                                                            )
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="p-3">
                                                        <select
                                                            value={
                                                                item.selectedVariantId
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateRowField(
                                                                    item.localId,
                                                                    'selectedVariantId',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                !item.selectedProduct
                                                            }
                                                            className="w-full border border-gray-300 rounded-md shadow-sm h-10 text-sm px-3 bg-white outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                                                        >
                                                            <option value="">
                                                                {t(
                                                                    'stock_ins.create.form.variant_placeholder'
                                                                )}
                                                            </option>
                                                            {item.selectedProduct?.variants?.map(
                                                                (v: any) => (
                                                                    <option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {v.name}{' '}
                                                                        - SKU:{' '}
                                                                        {v.sku}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </td>

                                                    <td className="p-3 text-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateRowField(
                                                                    item.localId,
                                                                    'quantity',
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="w-20 border border-gray-300 rounded-md shadow-sm h-10 text-sm px-2 text-center outline-none focus:border-blue-500 mx-auto block"
                                                        />
                                                    </td>

                                                    <td className="p-3 text-right">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                item.importPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateRowField(
                                                                    item.localId,
                                                                    'importPrice',
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="w-32 border border-gray-300 rounded-md shadow-sm h-10 text-sm px-3 text-right outline-none focus:border-blue-500 ml-auto block font-semibold text-gray-700"
                                                        />
                                                    </td>

                                                    <td className="p-3 text-right">
                                                        <span className="font-bold text-gray-800 block mt-2">
                                                            {formatCurrency(
                                                                item.quantity *
                                                                    item.importPrice
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="p-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveRow(
                                                                    item.localId
                                                                )
                                                            }
                                                            className="w-8 h-8 rounded-md text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center mx-auto mt-1"
                                                        >
                                                            <i className="fa-regular fa-trash-can text-base"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-50 border-t border-gray-200">
                                                <td
                                                    colSpan={4}
                                                    className="p-4 text-right font-bold text-gray-700 uppercase"
                                                >
                                                    {t(
                                                        'stock_ins.create.item_table.total_label'
                                                    )}
                                                </td>
                                                <td className="p-4 text-right font-bold text-base text-blue-600">
                                                    {formatCurrency(
                                                        calculateGrandTotal()
                                                    )}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTIONS SUBMIT */}
                    <div className="flex justify-end gap-3 pb-10">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/stock-ins')}
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
