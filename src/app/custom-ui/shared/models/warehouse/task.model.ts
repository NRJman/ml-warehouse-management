export interface Task {
    creationDate: Date;
    resolvingDate?: string;
    isResolved: boolean;
    description: string;
    assigneeId?: string;
}
