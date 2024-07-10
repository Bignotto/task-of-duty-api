import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User, UserType } from "@prisma/client";
import { hash } from "bcryptjs";
import { EmailAlreadyInUse } from "./errors/EmailAlreadyInUseError";

interface CreateNewUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType?: UserType;
}

interface CreateNewUserResponse {
  user: User;
}

export class CreateNewUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
    phone,
    userType,
  }: CreateNewUserRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyInUse();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
      phone,
      userType,
    });
    return { user };
  }
}
