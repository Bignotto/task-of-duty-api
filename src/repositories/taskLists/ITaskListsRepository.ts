import { Prisma, Task, TaskList } from "@prisma/client";

export interface ITaskListsRepository {
  create(data: Prisma.TaskListCreateInput): Promise<TaskList>;
  addTaskToList(taskId: bigint, taskListId: bigint): Promise<TaskList | null>;

  findTaskListById(taskListId: bigint): Promise<TaskList | null>;
  getTaskListTasksById(taskListId: bigint): Promise<Task[] | null>;
}
