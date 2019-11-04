import { InjectionToken } from '@angular/core';

export const USERS_API_SERVER_URL = 'http://localhost:3000/api/users/';
export const USERS_API_SERVER_URL_TOKEN: InjectionToken<string> = new InjectionToken(USERS_API_SERVER_URL);

export const INIT_API_SERVER_URL = 'http://localhost:3000/api/init/';
export const INIT_API_SERVER_URL_TOKEN: InjectionToken<string> = new InjectionToken(INIT_API_SERVER_URL);

export const ADMINS_API_SERVER_URL = 'http://localhost:3000/api/admins/';
export const ADMINS_API_SERVER_URL_TOKEN: InjectionToken<string> = new InjectionToken(INIT_API_SERVER_URL);
