import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7296/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,

    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            const value = params[key];

            if (Array.isArray(value)) {
                value.forEach((val) => searchParams.append(key, val));
            } else if (value !== undefined && value !== null) {
                searchParams.append(key, value);
            }
        });

        return searchParams.toString();
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                const currentPath = window.location.pathname;

                if (
                    currentPath !== '/login' &&
                    currentPath !== '/admin/login'
                ) {
                    const redirectUrl = currentPath.startsWith('/admin')
                        ? '/admin/login'
                        : '/login';
                    window.location.href = redirectUrl;
                    toast.error(
                        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                    );
                }
            }
        }
        return Promise.reject(error);
    }
);

export const UPLOAD_CONFIG: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
};

export default axiosInstance;
