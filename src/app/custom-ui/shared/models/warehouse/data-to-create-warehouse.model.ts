import { Area } from './area.model';

export interface DataToCreateWarehouse {
    areas: { name: string }[];
    adminId: string;
}
