import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './../custom-ui/auth/store/auth.reducer';
import * as fromAdmin from './../custom-ui/admin/store/admin.reducer';

export interface State {
  auth: fromAuth.State;
  admin: fromAdmin.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.authReducer,
  admin: fromAdmin.adminReducer
};
