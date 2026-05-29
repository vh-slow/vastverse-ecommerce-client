import axiosInstance, { UPLOAD_CONFIG } from './axios';
import { Category } from '../types';
import { emit } from 'process';

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

    //
    getChildrenCategoriesForAdmin: async (params?: {
        searchQuery?: string;
    }) => {
        try {
            const response = await axiosInstance.get(
                'api/admin/categories/children',
                {
                    params,
                }
            );
            return response.data.data;
        } catch (e) {
            console.error('Lỗi khi tải danh mục:', e);
            return [];
        }
    },

    getPgetParentCategoriesForAdmin: async (params = {}) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/categories/parents`,
                {
                    params,
                }
            );
            return response.data.data;
        } catch (e) {
            console.error('Fetch categories parent for admin error: ', e);
            throw e;
        }
    },

    createCategory: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                'api/admin/categories',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error creating category: ', error);
            throw error;
        }
    },

    updateCategory: async (id: string | number, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/categories/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error updating category: ', error);
            throw error;
        }
    },

    getCategoriesDetailForAdmin: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/categories/${id}`
            );
            return response.data.data;
        } catch (e) {
            console.error('Error fetching category by id: ', e);
            throw e;
        }
    },

    getCategoriesPaginationForAdmin: async (params: any) => {
        const response = await axiosInstance.get('api/admin/categories', {
            params,
        });
        return response.data.data;
    },

    deleteCategory: async (id: number) => {
        const response = await axiosInstance.delete(
            `api/admin/categories/${id}`
        );
        return response.data.data;
    },

    restoreCategory: async (id: number) => {
        const response = await axiosInstance.patch(
            `api/admin/categories/${id}/restore`
        );
        return response.data.data;
    },
};
