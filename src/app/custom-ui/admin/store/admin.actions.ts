import { createAction, props } from '@ngrx/store';
import { AdminInfo } from '../../shared/models/admin-info.model';

export const storeAdminInfo = createAction('[Admin] Store Admin Information', props<{ payload: AdminInfo }>());
