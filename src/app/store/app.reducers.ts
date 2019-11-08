import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './../custom-ui/auth/store/auth.reducer';
import * as fromAdmin from './../custom-ui/admin/store/admin.reducer';
import * as fromShared from './../custom-ui/shared/store/shared.reducer';
import * as fromSubordinate from './../custom-ui/subordinate/store/subordinate.reducer';

export interface State {
  auth: fromAuth.State;
  admin: fromAdmin.State;
  shared: fromShared.State;
  subordinate: fromSubordinate.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.authReducer,
  admin: fromAdmin.adminReducer,
  shared: fromShared.sharedReducer,
  subordinate: fromSubordinate.subordinateReducer
};
