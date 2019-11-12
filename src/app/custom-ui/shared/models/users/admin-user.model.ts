import { User } from './user.model';

export interface AdminUser extends User {
    warehouseId?: string;
    adminId: string;
    subordinateIds: string[];
}
