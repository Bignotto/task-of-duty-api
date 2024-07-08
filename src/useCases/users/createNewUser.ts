import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User, UserType } from "@prisma/client";
import { EmailAlreadyInUse } from "./erros/EmailAlreadyInUseError";

interface CreateNewUserRequest {
  name: string;
  email: string;
  phone?: string;
  userType?: UserType;
}

interface CreateNewUserResponse {}

export class CreateNewUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    phone,
    userType,
  }: CreateNewUserRequest): Promise<User> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyInUse();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      userType,
    });
    return user;
  }
}
