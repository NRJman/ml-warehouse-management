export interface CategoryPredictionResult { // This till be modified.
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
