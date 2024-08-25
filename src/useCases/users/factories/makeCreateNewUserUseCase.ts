import { PrismaInvitesRepository } from "@/repositories/invites/prisma/prismaInvitesRepository";
import { PrismaUsersRepository } from "@/repositories/users/prisma/usersRepository";
import { CreateNewUserUseCase } from "../createNewUser";

export function makeCreateNewUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const invitesRepository = new PrismaInvitesRepository();
  const createNewUserUseCase = new CreateNewUserUseCase(
    userRepository,
    invitesRepository,
  );

  return createNewUserUseCase;
}
