import { Prisma, User, UserType } from '@prisma/client'

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>

  setUserType(userId: string, userType: UserType): Promise<void>
  setUserOrganization(userId: string, organizationId: string): Promise<User>
}
