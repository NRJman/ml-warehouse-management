export interface DataToUpdateTask {
    userId: string;
    taskId: string;
    isInProgress?: boolean;
    warehouseId: string;
    endpointResource: string;
}
