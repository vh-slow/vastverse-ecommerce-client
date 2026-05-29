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

export interface VariantForm {
    id?: number;
    tempId: string;
    sku: string;
    variantName: string;
    price: string;
    initialStock: string;
    rawFile: File | null;
    previewUrl: string | null;
    originalImageUrl?: string | null;
}

export interface ProductSpecForm {
    tempId: string;
    specificationId: number | null;
    specificationName: string;
    value: string;
}

export interface ProductImageForm {
    id?: number;
    file?: File;
    preview: string;
    isMain?: boolean;
}
