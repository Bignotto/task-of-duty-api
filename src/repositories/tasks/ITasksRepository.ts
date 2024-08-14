import { Prisma, Task, TaskDone } from "@prisma/client";

export interface ITasksRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>;

  findById(taskId: bigint): Promise<Task | null>;

  assignUser(taskId: bigint, assigneeId: string): Promise<boolean>;

  markTaskDone(data: Prisma.TaskDoneCreateInput): Promise<TaskDone>;

  deleteTask(taskId: bigint): Promise<void>;
}
