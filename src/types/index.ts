export * from './user';
export * from './banner';
export * from './product';
export * from './category';
export * from './pagination';

export interface PagedResponse<T> {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        data: T[];
    };
}
