export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    parentId?: number | null;
    parentName?: string | null;
    createdAt?: string;
    subCategories?: Category[];
}
