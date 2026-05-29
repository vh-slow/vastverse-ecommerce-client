import axiosInstance from './axios';

export const apiSpecification = {
    getSpecifications: async (params = {}) => {
        const response = await axiosInstance.get('api/admin/specifications', {
            params,
        });
        return response.data;
    },

    getSpecificationsPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/specifications`,
                {
                    params,
                }
            );
            return response.data;
        } catch (e) {
            console.error(
                'Error fetching specifications pagination for admin: ',
                e
            );
            throw e;
        }
    },

    deleteSpecification: async (id: any) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/specifications/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error deleting specification: ', e);
            throw e;
        }
    },

    restoreSpecification: async (id: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/specifications/${id}/restore`
            );
            return response.data;
        } catch (e) {
            console.error('Error restoring specification: ', e);
            throw e;
        }
    },

    createSpecification: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/specifications`,
                data
            );
            return response.data;
        } catch (e) {
            console.error('Error creating specification: ', e);
            throw e;
        }
    },

    getSpecificationById: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/specifications/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error fetching specification by id: ', e);
            throw e;
        }
    },

    updateSpecification: async (id: any, data: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/specifications/${id}`,
                data
            );
            return response.data;
        } catch (e) {
            console.error('Error updating specification: ', e);
            throw e;
        }
    },
};
