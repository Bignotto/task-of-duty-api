import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { IInvitesRepository } from '../IInvitesRepository'

export class PrismaInvitesRepository implements IInvitesRepository {
  async create(data: Prisma.UserInviteCreateInput) {
    const invite = await prisma.userInvite.create({ data })
    return invite
  }

  async findById(id: string) {
    const invite = await prisma.userInvite.findUnique({
      where: {
        id,
      },
    })
    return invite
  }
}
