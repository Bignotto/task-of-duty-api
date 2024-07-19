import { Prisma, TaskList } from "@prisma/client";

export interface ITaskListsRepository {
  create(data: Prisma.TaskListCreateInput): Promise<TaskList>;
  addTask(taskId: bigint, taskListId: bigint): Promise<TaskList | null>;
  getTaskListById(taskId: bigint): Promise<TaskList | null>;
}
