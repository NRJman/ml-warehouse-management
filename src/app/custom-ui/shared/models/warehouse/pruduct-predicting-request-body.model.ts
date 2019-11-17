export interface ProductPredictingRequestBody {
    Inputs: {
        [input: string]: {
            subcategory: string;
            item_name: string;
            merchant_brand_name: string;
        }
    };
}
