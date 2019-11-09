import { SubordinateUser } from './subordinate-user.model';

export interface AdminSpecificDataFetchingResult {
    adminId: string;
    subordinates: SubordinateUser[];
}
