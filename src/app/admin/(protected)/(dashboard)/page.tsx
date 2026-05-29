'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Header from '@/src/components/admin/Header';
import { apiDashboard } from '@/src/services/dashboard';
import { BASE_URL } from '@/src/services';
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const COLORS = {
    Pending: '#f59e0b',
    PaymentFailed: '#ef4444',
    Confirmed: '#0ea5e9',
    Shipping: '#8b5cf6',
    Delivered: '#10b981',
    Canceled: '#64748b',
    Refunded: '#f97316',
    Returned: '#14b8a6',
};

const TIME_RANGE_MAP: Record<string, number> = {
    today: 1,
    last_7_days: 2,
    last_30_days: 3,
    this_month: 4,
    this_year: 5,
    all_time: 6,
};

const PercentBadge = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
        <div className="mt-3">
            <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md ${isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
            >
                <i
                    className={`fa-solid ${isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} mr-1.5`}
                ></i>
                {Math.abs(value)}%
            </span>
        </div>
    );
};

function DashboardContent() {
    const { t } = useTranslation(['admin', 'common']);
    const searchParams = useSearchParams();

    const timeRangeParam = searchParams.get('timeRange') || 'this_month';
    const fromDateParam = searchParams.get('fromDate');
    const toDateParam = searchParams.get('toDate');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<any>(null);
    const [revenueChart, setRevenueChart] = useState<any[]>([]);
    const [statusChart, setStatusChart] = useState<any[]>([]);
    const [activities, setActivities] = useState<any>({
        lowStockItems: [],
        recentOrders: [],
    });

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (timeRangeParam === 'custom') {
                params.TimeRange = 4;
                if (fromDateParam) params.CustomFromDate = fromDateParam;
                if (toDateParam) params.CustomToDate = toDateParam;
            } else {
                params.TimeRange = TIME_RANGE_MAP[timeRangeParam] || 4;
            }

            const [summaryData, revenueData, statusData, activityData] =
                await Promise.all([
                    apiDashboard.getSummary(params),
                    apiDashboard.getRevenueChart(params),
                    apiDashboard.getOrderStatusChart(params),
                    apiDashboard.getRecentActivities(),
                ]);

            setSummary(summaryData);
            setRevenueChart(revenueData || []);
            setStatusChart(statusData || []);
            setActivities(
                activityData || { lowStockItems: [], recentOrders: [] }
            );
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [timeRangeParam, fromDateParam, toDateParam]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (isLoading && !summary) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-gray-500 flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
                    <p className="font-medium text-sm">
                        {t('common.table.loading')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 px-4 sm:px-6 md:px-8 pb-4 bg-white animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-50 rounded-[43%_57%_71%_29%/53%_58%_42%_47%] group-hover:scale-150 group-hover:-rotate-12 transition-all duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                {t('dashboard.summary.revenue')}
                            </p>
                            <h3
                                className="text-2xl font-extrabold text-gray-900 truncate max-w-[160px] xl:max-w-[200px]"
                                title={formatCurrency(
                                    summary?.totalRevenue || 0
                                )}
                            >
                                {formatCurrency(summary?.totalRevenue || 0)}
                            </h3>
                            <PercentBadge
                                value={summary?.revenuePercentChange || 0}
                            />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl shrink-0">
                            <i className="fa-solid fa-money-bill-wave"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-[43%_57%_71%_29%/53%_58%_42%_47%] group-hover:scale-150 group-hover:-rotate-12 transition-all duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                {t('dashboard.summary.orders')}
                            </p>
                            <h3 className="text-3xl font-extrabold text-gray-900">
                                {summary?.newOrdersCount?.toLocaleString() || 0}
                            </h3>
                            <PercentBadge
                                value={summary?.ordersPercentChange || 0}
                            />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-50 rounded-[43%_57%_71%_29%/53%_58%_42%_47%] group-hover:scale-150 group-hover:-rotate-12 transition-all duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                {t('dashboard.summary.customers')}
                            </p>
                            <h3 className="text-3xl font-extrabold text-gray-900">
                                {summary?.newCustomersCount?.toLocaleString() ||
                                    0}
                            </h3>
                            <PercentBadge
                                value={summary?.customersPercentChange || 0}
                            />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
                            <i className="fa-solid fa-users"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-50 rounded-[43%_57%_71%_29%/53%_58%_42%_47%] group-hover:scale-150 group-hover:-rotate-12 transition-all duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                {t('dashboard.summary.pending_orders')}
                            </p>
                            <h3 className="text-3xl font-extrabold text-gray-900">
                                {summary?.pendingOrdersCount?.toLocaleString() ||
                                    0}
                            </h3>
                            <div className="mt-3">
                                <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md text-orange-700 bg-orange-100 border border-orange-200 animate-pulse relative z-10">
                                    <i className="fa-solid fa-bell mr-1.5"></i>{' '}
                                    Cần xử lý ngay
                                </span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0 relative z-10">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-area text-blue-500"></i>
                        {t('dashboard.charts.revenue_title')}
                    </h3>

                    {isLoading ? (
                        <div className="h-[320px] flex items-center justify-center text-gray-300">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl"></i>
                        </div>
                    ) : revenueChart.length > 0 ? (
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueChart}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorRevenue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) =>
                                            `${(val / 1000000).toLocaleString()}M`
                                        }
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                        formatter={(value: any, name: any) => [
                                            name === 'revenue'
                                                ? formatCurrency(value)
                                                : value,
                                            name === 'revenue'
                                                ? t(
                                                      'dashboard.charts.revenue_label'
                                                  )
                                                : t(
                                                      'dashboard.charts.orders_label'
                                                  ),
                                        ]}
                                    />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="orderCount"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fill="none"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[320px] flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            {t('dashboard.charts.no_data')}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-pie text-purple-500"></i>
                        {t('dashboard.charts.status_title')}
                    </h3>

                    {isLoading ? (
                        <div className="h-[320px] flex items-center justify-center text-gray-300">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl"></i>
                        </div>
                    ) : statusChart.length > 0 ? (
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusChart}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={75}
                                        outerRadius={105}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {statusChart.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        entry.status as keyof typeof COLORS
                                                    ] || '#cbd5e1'
                                                }
                                                stroke="transparent"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                        formatter={(value: any, name: any) => [
                                            value,
                                            t(
                                                `dashboard.status.${String(name)}`
                                            ),
                                        ]}
                                    />
                                    <Legend
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span className="text-gray-700 font-medium text-sm ml-1">
                                                {t(`dashboard.status.${value}`)}
                                            </span>
                                        )}
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[320px] flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            {t('dashboard.charts.no_data')}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-base font-bold text-gray-800">
                            {t('dashboard.activities.recent_orders')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
                            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-4">
                                        {t('dashboard.activities.table_order')}
                                    </th>
                                    <th className="px-5 py-4">
                                        {t(
                                            'dashboard.activities.table_customer'
                                        )}
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        {t('dashboard.activities.table_amount')}
                                    </th>
                                    <th className="px-5 py-4 text-center">
                                        {t('dashboard.activities.table_status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activities.recentOrders.map((order: any) => (
                                    <tr
                                        key={order.orderId}
                                        className="hover:bg-gray-50/80 transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <p className="font-bold text-blue-600 cursor-pointer hover:underline">
                                                #{order.orderCode}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5 flex items-center gap-3">
                                            <img
                                                src={
                                                    order.customerAvatar
                                                        ? `${BASE_URL}${order.customerAvatar}`
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName)}&background=f1f5f9&color=64748b`
                                                }
                                                alt="Avatar"
                                                className="w-9 h-9 rounded-full border border-gray-200 object-cover shrink-0"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800 truncate max-w-[150px]">
                                                    {order.customerName}
                                                </p>
                                                <p className="text-[11px] text-gray-500 truncate max-w-[150px]">
                                                    {order.customerEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-gray-900 text-right">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span
                                                className="text-xs font-semibold px-2.5 py-1 rounded-md"
                                                style={{
                                                    backgroundColor: `${COLORS[order.status as keyof typeof COLORS]}15`,
                                                    color: COLORS[
                                                        order.status as keyof typeof COLORS
                                                    ],
                                                }}
                                            >
                                                {t(
                                                    `dashboard.status.${order.status}`
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {activities.recentOrders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-10 text-center text-gray-400"
                                        >
                                            {t('dashboard.charts.no_data')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/40">
                        <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            {t('dashboard.activities.low_stock')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap min-w-[350px]">
                            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-4">
                                        {t(
                                            'dashboard.activities.table_product'
                                        )}
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        {t('dashboard.activities.table_stock')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activities.lowStockItems.map((item: any) => (
                                    <tr
                                        key={item.productVariantId}
                                        className="hover:bg-gray-50/80 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-lg border border-gray-200 bg-white p-0.5 shrink-0 shadow-sm">
                                                <img
                                                    src={
                                                        item.imageUrl
                                                            ? `${BASE_URL}${item.imageUrl}`
                                                            : 'https://placehold.co/44x44/f8fafc/94a3b8?text=Img'
                                                    }
                                                    alt="Product"
                                                    className="w-full h-full rounded-md object-cover"
                                                />
                                            </div>
                                            <div className="max-w-[200px] xl:max-w-[250px]">
                                                <p
                                                    className="font-semibold text-gray-800 truncate"
                                                    title={item.productName}
                                                >
                                                    {item.productName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 bg-gray-100 inline-block px-1.5 rounded">
                                                    SKU: {item.sku}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] h-7 px-2.5 text-[13px] font-bold bg-red-100 text-red-700 rounded-lg shadow-sm border border-red-200/50 animate-pulse">
                                                {item.currentStock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {activities.lowStockItems.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-5 py-10 text-center text-gray-400"
                                        >
                                            {t('dashboard.charts.no_data')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { t } = useTranslation(['admin']);
    const breadcrumbs = [
        {
            name: t('common.dashboard', { defaultValue: 'Admin' }),
            href: '/admin',
        },
        { name: t('dashboard.title', { defaultValue: 'Dashboard' }) },
    ];

    return (
        <>
            <Header title={t('dashboard.title')} breadcrumbs={breadcrumbs} />
            <Suspense
                fallback={
                    <div className="flex h-[80vh] items-center justify-center">
                        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500"></i>
                    </div>
                }
            >
                <DashboardContent />
            </Suspense>
        </>
    );
}
