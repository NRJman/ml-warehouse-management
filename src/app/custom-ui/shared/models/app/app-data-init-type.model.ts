import { Admin } from '../users/admin.model';
import { Subordinate } from '../users/subordinate.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { TokenInfo } from '../auth/token-info.model';

export interface UserDataInitType {
    user: Admin | Subordinate;
    tokenInfo?: TokenInfo;
}
