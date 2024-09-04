import { PrismaInvitesRepository } from "@/repositories/invites/prisma/prismaInvitesRepository";
import { CreateNewInviteUseCase } from "../createNewInvite";
import { PrismaUsersRepository } from "@/repositories/users/prisma/usersRepository";

export function makeCreateNewInviteUseCase() {
  const invitesRepository = new PrismaInvitesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new CreateNewInviteUseCase(invitesRepository, usersRepository)

  return useCase;
}