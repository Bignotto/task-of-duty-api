import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma/prismaOrganizationsRepository'
import { PrismaTasksRepository } from '@/repositories/tasks/prisma/prismaTasksRepository'
import { PrismaUsersRepository } from '@/repositories/users/prisma/usersRepository'
import { CreateNewTaskUseCase } from '../createNewTaskUseCase'

export function makeCreateTaskUseCase() {
  const tasksRepository = new PrismaTasksRepository()
  const usersRepository = new PrismaUsersRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()

  const createNewTaskUseCase = new CreateNewTaskUseCase(
    tasksRepository,
    usersRepository,
    organizationsRepository,
  )

  console.log('factory makeCreateTaskUseCase')
  return createNewTaskUseCase
}
