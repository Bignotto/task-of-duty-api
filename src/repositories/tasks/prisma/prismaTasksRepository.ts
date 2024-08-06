import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITasksRepository } from "../ITasksRepository";

export class PrismaTasksRepository implements ITasksRepository {
  async findById(taskId: bigint) {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    return task;
  }

  async assignUser(taskListId: bigint, assigneeId: string): Promise<boolean> {
    const result = await prisma.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        assignees: {
          connect: {
            id: assigneeId,
          },
        },
      },
    });

    if (!result) return false;

    return true;
  }
  async create(data: Prisma.TaskCreateInput) {
    const task = await prisma.task.create({ data });
    return task;
  }
}
