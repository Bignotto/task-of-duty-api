import {
  Prisma,
  RecurrenceType,
  Task,
  TaskDone,
  TaskType,
} from "@prisma/client";

export interface TaskUpdateInterface {
  id: bigint;
  title?: string;
  description?: string;
  recurrenceType?: RecurrenceType;
  taskType?: TaskType;
  dueDate?: Date;
}

export interface ITasksRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>;

  findById(taskId: bigint): Promise<Task | null>;

  assignUser(taskId: bigint, assigneeId: string): Promise<boolean>;

  markTaskDone(data: Prisma.TaskDoneCreateInput): Promise<TaskDone>;

  deleteTask(taskId: bigint): Promise<void>;

  updateTask(data: TaskUpdateInterface): Promise<Task>;

  unassignUser(taskId: bigint, assigneeId: string): Promise<boolean>;
}
