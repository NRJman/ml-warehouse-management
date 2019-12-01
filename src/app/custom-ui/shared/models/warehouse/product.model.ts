export interface Product {
    description: string;
    brandName: string;
    count: number;
    areaId: string;
    areaName?: string;
    isInWarehouse?: boolean;
    _id?: string;
}
