import { IInvitesRepository } from "@/repositories/invites/IInvitesRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { User, UserType } from "@prisma/client";
import { hash } from "bcryptjs";
import { EmailAlreadyInUseError } from "./errors/EmailAlreadyInUseError";
import { InvalidInviteError } from "./errors/InvalidInviteError";
import { PasswordLengthError } from "./errors/PasswordLengthError";

interface CreateNewUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType?: UserType;
  inviteId?: string;
}

interface CreateNewUserResponse {
  user: User;
}

export class CreateNewUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private invitesRepository: IInvitesRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
    userType,
    inviteId,
  }: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError();
    }

    if (password.length < 6) throw new PasswordLengthError();

    const passwordHash = await hash(password, 6);

    let invite;
    if (inviteId) {
      invite = await this.invitesRepository.findById(`${inviteId}`);
      if (!invite) throw new InvalidInviteError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
      phone,
      userType: inviteId ? UserType.USER : UserType.ORGANIZATION,
    });
    return { user };
  }
}
