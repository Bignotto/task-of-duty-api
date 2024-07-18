import { Prisma, TaskList } from "@prisma/client";

export interface ITaskListsRepository {
  create(data: Prisma.TaskListCreateInput): Promise<TaskList>;
  addTask(taskId: BigInt, listId: BigInt): Promise<void>;
}
