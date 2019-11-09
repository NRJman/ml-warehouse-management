import { Area } from './area.model';

export interface WarehouseCreationResult {
    areas: Area[];
    adminId: string;
    warehouseId: string;
}
