import axiosInstance from './axios';
import { Category } from '../types';

export const apiCategory = {
    getChildrenCategories: async (): Promise<Category[]> => {
        try {
            const response = await axiosInstance.get('api/categories/children');
            return response.data.data || [];
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            return [];
        }
    },
};
