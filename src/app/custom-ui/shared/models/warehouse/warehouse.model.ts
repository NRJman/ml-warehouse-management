import { Area } from './area.model';
import { Product } from './product.model';
import { Task } from './task.model';

export interface Warehouse {
    areas: Area[];
    products: Product[];
    taskList: Task[];
    adminId: string;
    warehouseId: string;
}
