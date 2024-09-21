import { PrismaTasksRepository } from '@/repositories/tasks/prisma/prismaTasksRepository'
import { GetTaskUseCase } from '../getTaskUseCase'

export function makeGetTaskUseCase() {
  const tasksRepository = new PrismaTasksRepository()

  const getTaskUseCase = new GetTaskUseCase(tasksRepository)

  return getTaskUseCase
}
