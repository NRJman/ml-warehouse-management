import { RegistrationUserData } from './registration-user-data.model';

export interface RegistrationSubordinateUsersData {
    registrationDataList: RegistrationUserData[];
    adminId: string;
    warehouseId: string;
}
