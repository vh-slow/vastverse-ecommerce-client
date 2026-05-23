export interface Banner {
    id: number;
    placement: string;
    placementId: number;
    displayOrder: number;
    isActive: boolean;
    subtitle?: string;
    title?: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    buttonText?: string;
    linkUrl?: string;
    createdAt: string;
}
