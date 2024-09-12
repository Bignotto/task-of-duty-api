import { prisma } from '@/lib/prisma'
import { Prisma, Task, TaskDone, User } from '@prisma/client'
import { ITasksRepository, TaskUpdateInterface } from '../ITasksRepository'

export class PrismaTasksRepository implements ITasksRepository {
  markTaskDone(data: Prisma.TaskDoneCreateInput): Promise<TaskDone> {
    throw new Error('Method not implemented.')
  }
  deleteTask(taskId: bigint): Promise<void> {
    throw new Error('Method not implemented.')
  }
  updateTask(data: TaskUpdateInterface): Promise<Task> {
    throw new Error('Method not implemented.')
  }
  unassignUser(taskId: bigint, assigneeId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getTaskUsers(taskId: bigint): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async findById(taskId: bigint) {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    return task
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
    })

    if (!result) return false

    return true
  }

  async create(data: Prisma.TaskCreateInput) {
    const task = await prisma.task.create({ data })
    return task
  }
}
