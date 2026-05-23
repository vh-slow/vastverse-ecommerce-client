import { ProductDetail, ProductCardItem } from '../types/product';
import axiosInstance from './axios';

export const apiProduct = {
    getNewArrivals: async (limit: number = 2): Promise<ProductCardItem[]> => {
        try {
            const response = await axiosInstance.get(
                `api/products/new-arrivals?limit=${limit}`
            );
            return response.data.data || [];
        } catch (error) {
            console.error('Lỗi khi tải New Arrivals:', error);
            return [];
        }
    },

    getBestSellers: async (limit: number = 4): Promise<ProductCardItem[]> => {
        try {
            const response = await axiosInstance.get(
                `api/products/best-sellers?limit=${limit}`
            );
            return response.data.data || [];
        } catch (error) {
            console.error('Lỗi khi tải Best Sellers:', error);
            return [];
        }
    },

    getPriceBounds: async (params: any) => {
        try {
            const response = await axiosInstance.get(
                'api/products/price-range',
                {
                    params,
                }
            );
            return response.data.data || { minPrice: 0, maxPrice: 100000000 };
        } catch (error) {
            console.error('Lỗi khi lấy khoảng giá:', error);
            return { minPrice: 0, maxPrice: 100000000 };
        }
    },

    getProducts: async (params: any) => {
        try {
            const response = await axiosInstance.get('api/products', {
                params,
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi tải danh sách sản phẩm:', error);
            throw error;
        }
    },

    getProductBySlug: async (slug: string): Promise<ProductDetail> => {
        try {
            const response = await axiosInstance.get(`api/products/${slug}`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            throw error;
        }
    },

    getSearchSuggestions: async (
        query: string,
        limit: number = 5
    ): Promise<string[]> => {
        try {
            const response = await axiosInstance.get(
                `api/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
            );
            return response.data.data || [];
        } catch (error) {
            console.error('Lỗi khi tải gợi ý tìm kiếm:', error);
            return [];
        }
    },

    getShowcaseProducts: async (params: any) => {
        try {
            const response = await axiosInstance.post(
                'api/products/just-for-you',
                params
            );
            return response.data;
        } catch (error) {
            console.error('Failed to get categories', error);
            throw error;
        }
    },
};
