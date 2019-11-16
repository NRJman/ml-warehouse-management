import { Product } from './product.model';

export interface DataToAddProducts {
    productsDataList: Product[];
    warehouseId: string;
}
