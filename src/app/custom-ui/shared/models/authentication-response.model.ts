import { TokenInfo } from './token-info.model';

export interface AuthenticationResponse {
    tokenInfo: TokenInfo;
    isAdmin: boolean;
}
