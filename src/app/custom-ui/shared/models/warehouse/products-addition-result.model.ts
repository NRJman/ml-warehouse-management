import { Product } from './product.model';
import { Area } from './area.model';

export interface ProductsAdditionResult {
    products: Product[];
    areas: Area[];
}
