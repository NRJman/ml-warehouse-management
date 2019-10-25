import { InjectionToken } from '@angular/core';

export const USERS_API_SERVER_URL = 'http://localhost:3000/api/users/';
export const USERS_API_SERVER_URL_TOKEN: InjectionToken<string> = new InjectionToken(USERS_API_SERVER_URL);
