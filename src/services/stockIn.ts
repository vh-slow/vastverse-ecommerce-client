import axiosInstance from './axios';

export const apiStockIn = {
    getStockInsPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/stock-ins`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error('Error fetching stock-ins pagination: ', e);
            throw e;
        }
    },

    createStockIn: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/stock-ins`,
                data
            );
            return response.data;
        } catch (e) {
            console.error('Error creating stock-in: ', e);
            throw e;
        }
    },

    getStockInById: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/stock-ins/${id}`
            );
            return response.data.data;
        } catch (e) {
            console.error('Error fetching stock-in detail: ', e);
            throw e;
        }
    },
};
