import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITasksRepository } from "../ITasksRepository";

export class PrismaTasksRepository implements ITasksRepository {
  async create(data: Prisma.TaskCreateInput) {
    const task = await prisma.task.create({ data });
    return task;
  }
}
