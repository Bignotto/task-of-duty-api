import { Prisma, Task, TaskList } from "@prisma/client";

export interface TaskListUpdateInterface {
  id: bigint;
  title?: string;
  description?: string;
}
export interface ITaskListsRepository {
  create(data: Prisma.TaskListCreateInput): Promise<TaskList>;
  addTaskToList(taskId: bigint, taskListId: bigint): Promise<TaskList | null>;

  findTaskListById(taskListId: bigint): Promise<TaskList | null>;
  getTaskListTasksById(taskListId: bigint): Promise<Task[] | null>;

  assignUser(taskListId: bigint, userId: string): Promise<boolean>;

  deleteTaskList(taskListId: bigint): Promise<void>;

  updateTaskList(data: TaskListUpdateInterface): Promise<TaskList>;

  removeTaskFromList(taskListId: bigint, taskId: bigint): Promise<boolean>;
}
