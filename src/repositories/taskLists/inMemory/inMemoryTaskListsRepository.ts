import { Prisma, TaskList } from "@prisma/client";
import { ITaskListsRepository } from "../ITaskListsRepository";

export class InMemoryTaskListsRepository implements ITaskListsRepository {
  private items: TaskList[] = [];

  async create(data: Prisma.TaskListCreateInput) {
    const newTaskList: TaskList = {
      id: BigInt(this.items.length + 1),
      title: data.title,
      description: data.description,
      creatorId: `${data.creator.connect?.id}`,
      organizationId: `${data.organization?.connect?.id}`,
    };

    this.items.push(newTaskList);

    return newTaskList;
  }
  addTask(taskId: BigInt, listId: BigInt): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
