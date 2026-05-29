import axiosInstance, { UPLOAD_CONFIG } from './axios';

export const apiSupplier = {
    getSuppliersPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/suppliers`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error('Error fetching suppliers pagination: ', e);
            throw e;
        }
    },

    getSupplierById: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/suppliers/${id}`
            );
            return response.data.data;
        } catch (e) {
            console.error('Error fetching supplier by id: ', e);
            throw e;
        }
    },

    createSupplier: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/suppliers`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error creating supplier: ', e);
            throw e;
        }
    },

    updateSupplier: async (id: any, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/suppliers/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error updating supplier: ', e);
            throw e;
        }
    },

    deleteSupplier: async (id: any) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/suppliers/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error deleting supplier: ', e);
            throw e;
        }
    },

    restoreSupplier: async (id: any) => {
        try {
            const response = await axiosInstance.patch(
                `api/admin/suppliers/${id}/restore`
            );
            return response.data;
        } catch (e) {
            console.error('Error restoring supplier: ', e);
            throw e;
        }
    },
};
