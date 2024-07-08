import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User, UserType } from "@prisma/client";

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
    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      userType,
    });
    return user;
  }
}
