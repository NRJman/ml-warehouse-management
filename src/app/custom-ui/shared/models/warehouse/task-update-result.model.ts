import { Task } from './task.model';

export interface TaskUpdateResult {
    updatedTask: Task;
    updatedTaskId: string;
}
