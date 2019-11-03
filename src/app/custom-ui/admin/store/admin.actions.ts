import { createAction, props } from '@ngrx/store';
import { Admin } from '../../shared/models/users/admin.model';

export const storeAdmin = createAction('[Admin] Store Admin Information', props<{ payload: Admin }>());
