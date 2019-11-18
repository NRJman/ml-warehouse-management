export interface ProductPredictionRequestBody {
    Inputs: {
        [input: string]: {
            ColumnNames: string[],
            Values: string[],
        }
    };
    GlobalParameters: object;
}
