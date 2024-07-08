import { PrismaUsersRepository } from "@/repositories/users/prisma/usersRepository";
import { CreateNewUserUseCase } from "../createNewUser";

export function makeCreateNewUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const createNewUserUseCase = new CreateNewUserUseCase(userRepository);

  return createNewUserUseCase;
}
