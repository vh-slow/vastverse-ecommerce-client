import axiosInstance from './axios';

export const apiUser = {
    getUsersPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/users`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error('Error fetching users pagination: ', e);
            throw e;
        }
    },

    changeUserStatus: async (id: any, status: number) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/users/${id}/status`,
                { Status: status }
            );
            return response.data;
        } catch (e) {
            console.error('Error changing user status: ', e);
            throw e;
        }
    },

    changeUserRole: async (id: any, roleId: number) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/users/${id}/role`,
                { RoleId: roleId }
            );
            return response.data;
        } catch (e) {
            console.error('Error changing user role: ', e);
            throw e;
        }
    },

    createUser: async (data: any) => {
        try {
            const response = await axiosInstance.post(`api/admin/users`, data);
            return response.data;
        } catch (e) {
            console.error('Error creating user: ', e);
            throw e;
        }
    },
};
