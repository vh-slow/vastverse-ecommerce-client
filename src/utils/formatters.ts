import { BASE_URL } from '../services';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const formatDateTime = (
    dateString: string | null | undefined
): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const getImageUrl = (url: string | null | undefined) => {
    if (!url) return 'https://placehold.co/40x40/f1f5f9/334155?text=Img';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanBaseUrl = BASE_URL.endsWith('/')
        ? BASE_URL.slice(0, -1)
        : BASE_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBaseUrl}${cleanUrl}`;
};
