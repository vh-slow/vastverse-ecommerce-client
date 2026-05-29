'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/admin/Header';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiStockIn } from '@/src/services/stockIn';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime } from '@/src/utils/formatters';
import { BASE_URL } from '@/src/services';

export default function StockInDetailPage() {
    const { t } = useTranslation(['admin']);
    const router = useRouter();
    const params = useParams();
    const stockInId = params?.id as string;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [stockIn, setStockIn] = useState<any | null>(null);

    useEffect(() => {
        if (!stockInId) return;

        const loadStockInDetail = async () => {
            try {
                const data = await apiStockIn.getStockInById(stockInId);
                setStockIn(data);
            } catch (error) {
                console.error(error);
                toast.error(t('stock_ins.detail.messages.error'));
                router.push('/admin/stock-ins');
            } finally {
                setIsLoading(false);
            }
        };

        loadStockInDetail();
    }, [stockInId, router]);

    const handlePrintPDF = async () => {
        const toastId = toast.loading(t('stock_ins.detail.messages.init_pdf'));
        try {
            const { pdf } = await import('@react-pdf/renderer');
            const { default: StockInPDF } =
                await import('@/src/components/admin/pdf/StockInPDF');

            const blob = await pdf(<StockInPDF stockIn={stockIn} />).toBlob();

            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            toast.success(t('stock_ins.detail.messages.init_pdf_success'), {
                id: toastId,
            });
        } catch (error) {
            console.error(error);
            toast.error('stock_ins.detail.messages.init_pdf_failed', {
                id: toastId,
            });
        }
    };

    const breadcrumbs = [
        { name: t('common.dashboard'), href: '/admin' },
        { name: t('stock_ins.title'), href: '/admin/stock-ins' },
        { name: t('stock_ins.detail.title') },
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
            </div>
        );
    }

    if (!stockIn) return null;

    return (
        <>
            <Header
                title={t('stock_ins.detail.title')}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex-1 px-6 py-2 pb-10">
                {/* <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.push('/admin/stock-ins')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm"
                    >
                        <i className="fa-solid fa-arrow-left ms-1"></i>{' '}
                        {t('common.actions.back')}
                    </button>
                </div> */}

                <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-200 shadow-sm max-w-[1200px] mx-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                                {t('stock_ins.detail.title')}
                            </h1>
                            <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <span>{t('stock_ins.detail.receipt_id')}</span>
                                <span className="bg-gray-100/80 px-2 py-0.5 rounded font-mono text-gray-800 font-medium border border-gray-200">
                                    #{stockIn.id}
                                </span>
                                <span className="mx-1 text-gray-300">|</span>
                                <span>{t('stock_ins.detail.date')}</span>
                                <span className="text-gray-800">
                                    {formatDateTime(stockIn.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handlePrintPDF}
                                className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm border border-gray-300"
                            >
                                <i className="fa-solid fa-print"></i>{' '}
                                {t('stock_ins.detail.print_pdf')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                        <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1.5">
                                {t('stock_ins.detail.supplier')}
                            </p>
                            <p className="font-medium text-gray-800 text-[15px]">
                                {stockIn.supplierName}
                            </p>
                        </div>

                        <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1.5">
                                {t('stock_ins.detail.creator')}
                            </p>
                            <p className="font-medium text-gray-800 text-[15px]">
                                {stockIn.creatorName}
                            </p>
                        </div>

                        <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1.5">
                                {t('stock_ins.detail.note')}
                            </p>
                            <p className="font-medium text-gray-800 text-[15px] italic">
                                {stockIn.note || (
                                    <span className="text-gray-400 not-italic">
                                        Không có
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {t('stock_ins.detail.card_items')}
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y border-gray-200 text-xs text-gray-500 uppercase">
                                        <th className="py-4 px-2 text-center font-semibold w-16">
                                            STT
                                        </th>
                                        <th className="py-4 px-2 text-left font-semibold">
                                            {t(
                                                'stock_ins.create.item_table.product'
                                            )}
                                        </th>
                                        <th className="py-4 px-2 text-center font-semibold w-28">
                                            {t(
                                                'stock_ins.create.item_table.quantity'
                                            )}
                                        </th>
                                        <th className="py-4 px-2 text-right font-semibold w-40">
                                            {t(
                                                'stock_ins.create.item_table.price'
                                            )}
                                        </th>
                                        <th className="py-4 px-2 text-right font-semibold w-40">
                                            {t(
                                                'stock_ins.create.item_table.subtotal'
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stockIn.items.map(
                                        (item: any, index: number) => (
                                            <tr
                                                key={item.productVariantId}
                                                className="hover:bg-gray-50/30 transition-colors"
                                            >
                                                <td className="py-4 px-2 font-medium text-gray-600 text-center align-middle">
                                                    {index + 1}
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-0.5 shrink-0 flex items-center justify-center">
                                                            <img
                                                                src={`${BASE_URL}${item.imageUrl}`}
                                                                alt="Img"
                                                                className="w-full h-full object-contain rounded-md"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.src =
                                                                        'https://placehold.co/48x48/f1f5f9/334155?text=P';
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 text-[15px] mb-0.5">
                                                                {
                                                                    item.productName
                                                                }
                                                            </p>
                                                            <p className="text-[13px] text-gray-500">
                                                                SKU: {item.sku}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-center align-middle">
                                                    <span className="font-semibold text-gray-800 text-[15px]">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-right align-middle">
                                                    <span className="text-gray-600 font-medium">
                                                        {formatCurrency(
                                                            item.importPrice
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-right align-middle">
                                                    <span className="font-medium text-gray-900">
                                                        {formatCurrency(
                                                            item.subtotal
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="pt-6 pb-2 text-right font-medium text-gray-600 uppercase tracking-wide"
                                        >
                                            {t(
                                                'stock_ins.create.item_table.total_label'
                                            )}
                                        </td>
                                        <td className="pt-6 pb-2 text-right font-medium text-base text-blue-600">
                                            {formatCurrency(
                                                stockIn.totalAmount
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
