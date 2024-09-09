import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma/prismaOrganizationsRepository'
import { PrismaUsersRepository } from '@/repositories/users/prisma/usersRepository'
import { CreateNewOrganizationUseCase } from '../createNewOrganization'

export function makeCreateNewOrganizationUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()
  const usersRepository = new PrismaUsersRepository()
  const createNewOrganizationUseCase = new CreateNewOrganizationUseCase(
    organizationsRepository,
    usersRepository,
  )

  return createNewOrganizationUseCase
}
