export interface CategoryPredictionResult {
    Results: {
        [output: string]: {
            type: string;
            value: {
                ColumnNames: string[],
                ColumnTypes: string[],
                Values: string[]
            }
        }
    };
}
