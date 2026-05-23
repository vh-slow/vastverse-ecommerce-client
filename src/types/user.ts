export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        avatar: string | null;
        email: string;
        role: string;
        token: string;
    };
}
