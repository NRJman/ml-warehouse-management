import { DataToFetchSpecificProductInfo } from './data-to-fetch-specific-product-info.model';

export interface DataToFetchSpecificProductInfoByPhoto extends DataToFetchSpecificProductInfo {
    fileBase64Code: string;
}
