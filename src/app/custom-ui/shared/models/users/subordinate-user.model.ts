import { User } from './user.model';

export interface SubordinateUser extends User {
    warehouseId: string;
}
