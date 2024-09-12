import { PrismaTasksRepository } from "@/repositories/tasks/prisma/prismaTasksRepository";
import { PrismaUsersRepository } from "@/repositories/users/prisma/usersRepository";
import { CreateNewTaskUseCase } from "../createNewTaskUseCase";

export function makeCreateNewTaskUseCase() {
  const tasksRepository = new PrismaTasksRepository()
  const usersRepository = new PrismaUsersRepository()

  const createNewTaskUseCase = new CreateNewTaskUseCase(tasksRepository, usersRepository)

  return createNewTaskUseCase

}