import { Prisma, TaskList } from "@prisma/client";
import { ITaskListsRepository } from "../ITaskListsRepository";

export class InMemoryTaskListsRepository implements ITaskListsRepository {
  private lists: TaskList[] = [];

  private tasks: bigint[] = [];

  private list_have_tasks: {
    listId: bigint;
    taskId: bigint;
  }[] = [];

  async create(data: Prisma.TaskListCreateInput) {
    const newTaskList: TaskList = {
      id: BigInt(this.lists.length + 1),
      title: data.title,
      description: data.description,
      creatorId: `${data.creator.connect?.id}`,
      organizationId: `${data.organization?.connect?.id}`,
    };

    this.lists.push(newTaskList);

    return newTaskList;
  }

  async addTask(taskId: bigint, taskListId: bigint) {
    const i = this.lists.findIndex((item) => item.id === taskListId);
    if (i < 0) return null;

    this.tasks.push(taskId);
    this.list_have_tasks.push({
      listId: taskListId,
      taskId,
    });

    return this.lists[i];
  }

  async getTaskListById(taskId: bigint) {
    const list = this.lists.find((i) => i.id === taskId);
    if (!list) return null;
    return list;
  }
}
