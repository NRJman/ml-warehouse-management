import { TokenInfo } from './token-info.model';

export interface AuthenticationResult {
    tokenInfo: TokenInfo;
    isAdmin: boolean;
}
