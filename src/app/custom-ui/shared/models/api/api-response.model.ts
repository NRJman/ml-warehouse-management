export interface ApiResponse<T> {
    message: string;
    result: T;
    error?: object;
}
