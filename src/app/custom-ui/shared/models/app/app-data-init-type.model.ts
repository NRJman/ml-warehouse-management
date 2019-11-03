import { Admin } from '../users/admin.model';
import { Subordinate } from '../users/subordinate.model';
import { Warehouse } from '../warehouse/warehouse.model';

export interface AppDataInitType {
    user: Admin | Subordinate;
    warehouseInfo?: Warehouse;
}
