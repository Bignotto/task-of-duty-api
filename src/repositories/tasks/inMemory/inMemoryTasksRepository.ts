import { Prisma, Task, TaskDone } from "@prisma/client";
import { ITasksRepository } from "../ITasksRepository";

export class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = [];
  public usersAssignedTasks: {
    taskIndex: number;
    userId: string;
  }[] = [];

  public tasksDone: TaskDone[] = [];

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
      taskIndex: index,
      userId: assigneeId,
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
}
