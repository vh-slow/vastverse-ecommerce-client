import axiosInstance, { UPLOAD_CONFIG } from './axios';
import { Banner } from '../types';

export const apiBanner = {
    getBannersByPlacement: async (placementId: number): Promise<Banner[]> => {
        try {
            const response = await axiosInstance.get(
                `api/banners?placement=${placementId}`
            );
            return response.data.data || [];
        } catch (error) {
            console.error('Lỗi khi tải Banners:', error);
            return [];
        }
    },

    getBannersPaginationForAdmin: async (params: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/banners`, {
                params,
            });
            return response.data;
        } catch (e) {
            console.error('Error fetching banners pagination for admin: ', e);
            throw e;
        }
    },

    deleteBanner: async (id: any) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/banners/${id}`
            );
            return response.data;
        } catch (e) {
            console.error('Error deleting banner: ', e);
            throw e;
        }
    },

    restoreBanner: async (id: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/banners/${id}/restore`
            );
            return response.data;
        } catch (e) {
            console.error('Error restoring banner: ', e);
            throw e;
        }
    },

    createBanner: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/banners`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error creating banner: ', e);
            throw e;
        }
    },

    getBannerById: async (id: any) => {
        try {
            const response = await axiosInstance.get(`api/admin/banners/${id}`);
            return response.data.data;
        } catch (e) {
            console.error('Error fetching banner by id: ', e);
            throw e;
        }
    },

    updateBanner: async (id: any, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/banners/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (e) {
            console.error('Error updating banner: ', e);
            throw e;
        }
    },
};
