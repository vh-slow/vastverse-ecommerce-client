import { ProductDetail, ProductCardItem } from '../types/product';
import axiosInstance, { UPLOAD_CONFIG } from './axios';

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

    //ADMIN ROUTES
    getProductsPaginationForAdmin: async (params = {}) => {
        try {
            const response = await axiosInstance.get(`api/admin/products`, {
                params,
            });
            return response.data.data;
        } catch (e) {
            console.error('Fetch all product for admin error: ', e);
            throw e;
        }
    },

    createProduct: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                'api/admin/products',
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error creating product: ', error);
            throw error;
        }
    },

    uploadProductImages: async (id: any, data: FormData) => {
        try {
            const response = await axiosInstance.post(
                `api/admin/products/${id}/images`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading product images: ', error);
            throw error;
        }
    },

    uploadTempVariantImage: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                'api/admin/products/upload-temp-variant',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading temp variant image: ', error);
            throw error;
        }
    },

    getProductSpecifications: async (productId: number | string) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/products/${productId}/specifications`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching product specifications:', error);
            throw error;
        }
    },

    updateProductSpecifications: async (productId: any, data: any) => {
        const response = await axiosInstance.put(
            `api/admin/products/${productId}/specifications`,
            data
        );
        return response.data;
    },

    getProductById: async (id: any) => {
        try {
            const response = await axiosInstance.get(
                `api/admin/products/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching product by id: ', error);
            throw error;
        }
    },

    updateProduct: async (id: any, data: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/products/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error updating product: ', error);
            throw error;
        }
    },

    deleteProduct: async (id: any) => {
        try {
            const response = await axiosInstance.delete(
                `api/admin/products/${id}`
            );
            console.log('Delete product success:', response.data);
            return response.data;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    },

    restoreProduct: async (id: any) => {
        try {
            const response = await axiosInstance.put(
                `api/admin/products/${id}/restore`
            );
            console.log('Restore product success:', response.data);
            return response.data;
        } catch (error) {
            console.error('Restore product error:', error);
            throw error;
        }
    },
};
