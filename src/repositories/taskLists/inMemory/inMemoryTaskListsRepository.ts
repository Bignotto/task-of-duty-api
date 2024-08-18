import {
  Prisma,
  RecurrenceType,
  Task,
  TaskList,
  TaskType,
} from "@prisma/client";
import { ITaskListsRepository } from "../ITaskListsRepository";

export class InMemoryTaskListsRepository implements ITaskListsRepository {
  public lists: TaskList[] = [];
  private tasks: Task[] = [];

  private list_have_tasks: {
    listId: bigint;
    taskId: bigint;
  }[] = [];

  private assigned_users: {
    listId: bigint;
    userId: string;
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

  async addTaskToList(taskId: bigint, taskListId: bigint) {
    const i = this.lists.findIndex((item) => item.id === taskListId);
    if (i < 0) return null;

    this.tasks.push({
      createDate: new Date(),
      creatorId: "some user id",
      description: "some description",
      title: "some title",
      dueDate: new Date(),
      id: BigInt(taskId),
      organizationId: "some or id",
      recurrenceType: RecurrenceType.EXACT,
      taskType: TaskType.TASK,
    });

    this.list_have_tasks.push({
      listId: taskListId,
      taskId,
    });

    return this.lists[i];
  }

  async findTaskListById(taskListId: bigint) {
    const list = this.lists.find((i) => i.id === taskListId);
    if (!list) return null;
    return list;
  }

  async getTaskListTasksById(taskListId: bigint) {
    const listTasksIds = this.list_have_tasks.filter(
      (l) => (l.listId = taskListId),
    );
    const tasks = this.tasks.filter((t) =>
      listTasksIds.find((l) => l.taskId === t.id),
    );

    return tasks;
  }

  async assignUser(taskListId: bigint, userId: string): Promise<boolean> {
    this.assigned_users.push({
      listId: taskListId,
      userId,
    });

    return Promise.resolve(true);
  }

  async deleteTaskList(taskListId: bigint): Promise<void> {
    const taskListIndex = this.lists.findIndex(
      (list) => list.id === taskListId,
    );
    this.lists.splice(taskListIndex, 1);

    const relation = this.list_have_tasks.filter(
      (relation) => relation.listId !== taskListId,
    );
    this.list_have_tasks = relation;
  }
}
