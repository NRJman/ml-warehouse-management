import { Area } from './area.model';
import { Product } from './product.model';
import { Task } from './task.model';

export interface WarehouseDataFetchingResult {
    areas: Area[];
    products: Product[];
    tasks: Task[];
    adminId: string;
    warehouseId: string;
}
