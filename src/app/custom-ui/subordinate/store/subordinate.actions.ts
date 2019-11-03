import { createAction, props } from '@ngrx/store';
import { SubordinateInfo } from '../../shared/models/subordinate-info.model';

export const storeSubordinateInfo = createAction(
    '[Admin] Store Subordinate Information',
    props<{ payload: SubordinateInfo }>()
);
