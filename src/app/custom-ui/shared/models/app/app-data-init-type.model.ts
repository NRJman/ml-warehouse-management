import { TokenInfo } from '../auth/token-info.model';
import { User } from '../users/user.model';

export interface UserDataInitType {
    tokenInfo?: TokenInfo;
    user: User;
    isAdmin: boolean;
}
