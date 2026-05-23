import axiosInstance from './axios';
import { LoginRequest, LoginResponse } from '../types/user';

export const apiAuth = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosInstance.post('api/auth/login', data);
            return response.data;
        } catch (error) {
            console.error('Login error: ', error);
            throw error;
        }
    },

    register: async (data: LoginRequest) => {
        try {
            const response = await axiosInstance.post('api/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    forgotPassword: async (email: string) => {
        try {
            const response = await axiosInstance.post('api/auth/forgot-password', {
                email,
            });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    resetPassword: async (email: string) => {
        try {
            const response = await axiosInstance.post('api/auth/reset-password', {
                email,
            });
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },
};
