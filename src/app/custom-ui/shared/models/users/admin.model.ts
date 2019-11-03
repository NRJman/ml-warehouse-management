export interface Admin {
    name: string;
    phone: number;
    userId: string;
    isAdmin: true;
    adminId: string;
    warehouseId?: string;
    subordinateIds?: string[];
}
