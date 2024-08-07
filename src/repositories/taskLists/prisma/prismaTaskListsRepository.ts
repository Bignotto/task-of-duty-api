import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITaskListsRepository } from "../ITaskListsRepository";

export class PrismaTaskListsRepository implements ITaskListsRepository {
  async addTaskToList(taskId: bigint, taskListId: bigint) {
    const result = await prisma.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        tasks: {
          connect: {
            id: taskId,
          },
        },
      },
    });

    return result;
  }

  async findTaskListById(taskListId: bigint) {
    const taskList = await prisma.taskList.findUnique({
      where: {
        id: taskListId,
      },
    });

    return taskList;
  }

  async getTaskListTasksById(taskListId: bigint) {
    const taskList = await prisma.taskList.findUnique({
      where: {
        id: taskListId,
      },
      include: {
        tasks: true,
      },
    });

    if (!taskList || taskList.tasks.length === 0) return null;
    return taskList.tasks;
  }

  async assignUser(taskListId: bigint, userId: string): Promise<boolean> {
    const taskList = await prisma.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        assignees: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (!taskList) return false;
    return true;
  }

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
