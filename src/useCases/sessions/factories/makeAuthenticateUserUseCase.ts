import { PrismaUsersRepository } from "@/repositories/users/prisma/usersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser";

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

  return authenticateUserUseCase;
}
