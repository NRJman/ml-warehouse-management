import { createAction, props } from '@ngrx/store';
import { AdminInfo } from '../../shared/models/admin-info.model';

export const createAdmin = createAction('[Admin] Create Admin', props<{ adminInfo: AdminInfo }>());
