import axiosInstance from './axios';
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
};
