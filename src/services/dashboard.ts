import axiosInstance from './axios';

export const apiDashboard = {
    getSummary: async (params: any) => {
        const response = await axiosInstance.get(
            `api/admin/dashboard/summary`,
            { params }
        );
        return response.data.data;
    },
    getRevenueChart: async (params: any) => {
        const response = await axiosInstance.get(
            `api/admin/dashboard/revenue-chart`,
            { params }
        );
        return response.data.data;
    },
    getOrderStatusChart: async (params: any) => {
        const response = await axiosInstance.get(
            `api/admin/dashboard/order-status-chart`,
            { params }
        );
        return response.data.data;
    },
    getTopProducts: async (params: any) => {
        const response = await axiosInstance.get(
            `api/admin/dashboard/top-products`,
            { params }
        );
        return response.data.data;
    },
    getRecentActivities: async () => {
        const response = await axiosInstance.get(
            `api/admin/dashboard/recent-activities`
        );
        return response.data.data;
    },
};
