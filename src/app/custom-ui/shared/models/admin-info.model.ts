export interface AdminInfo {
    name: string;
    phone: number;
    userId: string;
    adminId: string;
    warehouseId?: string;
    subordinateIds?: string[];
}
