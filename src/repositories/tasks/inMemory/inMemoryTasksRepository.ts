import { Prisma, Task, TaskDone, User } from "@prisma/client";
import { ITasksRepository, TaskUpdateInterface } from "../ITasksRepository";

export class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = [];
  public usersAssignedTasks: {
    taskId: bigint;
    userId: string;
  }[] = [];

  public tasksDone: TaskDone[] = [];
  private users: User[] = [];

  async create(data: Prisma.TaskCreateInput) {
    const tomorrow = new Date();
    const duoDate = new Date(`${data.dueDate}`);

    tomorrow.setDate(tomorrow.getDate() + 1);
    const task: Task = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? duoDate : tomorrow,
      recurrenceType: data.recurrenceType,
      taskType: data.taskType,
      creatorId: `${data.creator.connect?.id}`,
      organizationId: `${data.organization?.connect?.id}`,
      id: BigInt(this.items.length),
      createDate: new Date(),
    };

    this.items.push(task);
    return task;
  }

  async findById(taskId: bigint) {
    const task = this.items.find((task) => task.id === taskId);
    if (!task) return null;
    return task;
  }

  async assignUser(taskId: bigint, assigneeId: string) {
    const index = this.items.findIndex((item) => item.id === taskId);
    if (index < 0) return false;

    this.usersAssignedTasks.push({
      taskId: taskId,
      userId: assigneeId,
    });

    this.users.push({
      id: assigneeId,
      email: "some@email.com",
      name: "user name",
      partOfOrganizationId: "org id",
      passwordHash: "hahaha",
      phone: "12345678901",
      userType: "ORGANIZATION",
    });

    return true;
  }

  async markTaskDone(data: Prisma.TaskDoneCreateInput): Promise<TaskDone> {
    const taskDone: TaskDone = {
      comment: `${data.comment}`,
      doneDate: new Date(),
      id: BigInt(this.tasksDone.length + 1),
      organizationId: `${data.organization.connect?.id}`,
      taskId: BigInt(`${data.task.connect?.id}`),
      userId: `${data.user.connect?.id}`,
    };

    this.tasksDone.push(taskDone);

    return taskDone;
  }

  async deleteTask(taskId: bigint): Promise<void> {
    const taskIndex = this.items.findIndex((t) => t.id === taskId);
    this.items.splice(taskIndex, 1);
  }

  async updateTask(data: TaskUpdateInterface): Promise<Task> {
    const taskIndex = this.items.findIndex((t) => t.id === data.id);

    this.items[taskIndex].title = data.title ?? this.items[taskIndex].title;
    this.items[taskIndex].description =
      data.description ?? this.items[taskIndex].description;
    this.items[taskIndex].recurrenceType =
      data.recurrenceType ?? this.items[taskIndex].recurrenceType;
    this.items[taskIndex].taskType =
      data.taskType ?? this.items[taskIndex].taskType;
    this.items[taskIndex].dueDate =
      data.dueDate ?? this.items[taskIndex].dueDate;

    return this.items[taskIndex];
  }

  async unassignUser(taskId: bigint, assigneeId: string): Promise<boolean> {
    const relationIndex = this.usersAssignedTasks.findIndex(
      (i) => i.taskId === taskId && i.userId === assigneeId,
    );
    if (relationIndex < 0) return false;

    this.usersAssignedTasks.splice(relationIndex, 1);

    return true;
  }

  async getTaskUsers(taskId: bigint): Promise<User[]> {
    const taskUsers = this.usersAssignedTasks.filter(
      (t) => t.taskId === taskId,
    );

    const users = this.users.filter((u) =>
      taskUsers.find((t) => u.id === t.userId),
    );

    return users;
  }
}
