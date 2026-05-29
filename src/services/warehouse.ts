import axiosInstance from './axios';

export const apiWarehouse = {
    getWarehousesPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/warehouses`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error('Error fetching warehouses: ', e);
            throw e;
        }
    },

    getWarehouseById: async (id: number) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/warehouses/${id}`
            );
            return response.data.data;
        } catch (e) {
            console.error('Error fetching warehouse details: ', e);
            throw e;
        }
    },

    createWarehouse: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/warehouses`,
                data
            );
            return response.data;
        } catch (e) {
            console.error('Error creating warehouse: ', e);
            throw e;
        }
    },

    updateWarehouse: async (id: number, data: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/warehouses/${id}`,
                data
            );
            return response.data;
        } catch (e) {
            console.error('Error updating warehouse: ', e);
            throw e;
        }
    },

    deleteWarehouse: async (id: number) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/warehouses/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error deleting warehouse: ', e);
            throw e;
        }
    },

    restoreWarehouse: async (id: number) => {
        try {
            const response = await axiosInstance.patch(
                `api/admin/warehouses/${id}/restore`
            );
            return response.data;
        } catch (e) {
            console.error('Error restoring warehouse: ', e);
            throw e;
        }
    },

    setActiveWarehouse: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/warehouses/${id}/set-active`
            );
            return response.data;
        } catch (e) {
            console.error('Error setting active warehouse: ', e);
            throw e;
        }
    },
};
