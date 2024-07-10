import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserUseCaseResponse {
  user: User;
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const passwordHash = await hash(password, 6);

    if (passwordHash !== user.passwordHash) throw new InvalidCredentialsError();

    return { user };
  }
}
