import { DataToFetchSpecificProductInfo } from './data-to-fetch-specific-product-info.model';

export interface DataToFetchSpecificProductInfoByText extends DataToFetchSpecificProductInfo {
    productId: string;
}
