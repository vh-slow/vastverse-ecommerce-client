export interface ProductCardItem {
    id: number;
    name: string;
    slug: string;
    minPrice: number;
    mainImage: string;
    categoryName: string;
    totalSales: number;
}

export interface ProductVariant {
    id: number;
    sku: string;
    variantName: string;
    price: number;
    stockQuantity: number;
}

export interface Product extends ProductCardItem {
    status: number;
    variants: ProductVariant[];
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    categoryName: string;
    images: string[];
    variants: ProductVariant[];
    specifications: any[];
}

export interface PriceRangeResponse {
    minPrice: number;
    maxPrice: number;
}
