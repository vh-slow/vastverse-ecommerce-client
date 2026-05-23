'use client';

import {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { LoginRequest, User } from '../types';
import { apiAuth } from '../services';

interface AuthContextType {
    user: User | null;
    login: (data: LoginRequest) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
    refreshUser: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Failed to load user from localStorage', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (data: LoginRequest): Promise<User> => {
        const response = await apiAuth.login(data);

        if (response && response.statusCode === 200 && response.data?.token) {
            const userData = response.data;

            const loggedInUser: User = {
                id: userData.id,
                name: userData.name,
                role: userData.role,
                email: userData.email,
                avatarUrl: userData.avatar || undefined,
            };

            localStorage.setItem('user', JSON.stringify(loggedInUser));
            localStorage.setItem('token', userData.token);
            setUser(loggedInUser);

            return loggedInUser;
        } else {
            throw new Error(
                response?.message || 'Đăng nhập thất bại từ máy chủ.'
            );
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const refreshUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isLoading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
