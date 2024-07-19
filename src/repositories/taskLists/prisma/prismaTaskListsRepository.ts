import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITaskListsRepository } from "../ITaskListsRepository";

export class PrismaTaskListsRepository implements ITaskListsRepository {
  async create(data: Prisma.TaskListCreateInput) {
    const list = await prisma.taskList.create({
      data,
    });

    return list;
  }
  async addTask(taskId: bigint, taskListId: bigint) {
    const list = prisma.taskList.update({
      where: { id: taskListId },
      data: {
        tasks: { connect: { id: taskId } },
      },
    });

    return list;
  }

  async getTaskListById(taskId: bigint) {
    const list = await prisma.taskList.findUnique({ where: { id: taskId } });

    return list;
  }
}
