import { User } from './user.model';

export interface AdminUser extends User {
    adminId: string;
    subordinateIds: string[];
}
