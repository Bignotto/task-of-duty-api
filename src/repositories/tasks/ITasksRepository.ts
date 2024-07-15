import { Prisma, Task } from "@prisma/client";

export interface ITasksRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>;
}
