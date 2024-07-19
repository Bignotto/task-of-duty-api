import { Prisma, Task } from "@prisma/client";
import { ITasksRepository } from "../ITasksRepository";

export class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = [];
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
}
