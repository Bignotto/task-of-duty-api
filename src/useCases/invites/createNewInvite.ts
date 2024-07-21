import { IInvitesRepository } from "@/repositories/invites/IInvitesRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { UserInvite, UserType } from "@prisma/client";
import { addDays, isBefore } from "date-fns";
import { InvalidDateError } from "./errors/InvalidDateError";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneError";
import { NotFoundError } from "./errors/NotFoundError";
import { NotOrganizationAdminError } from "./errors/NotOrganizationAdmin";

interface CreateNewInviteRequest {
  organizationId: string;
  creatorId: string;
  invitedPhone: string;
  invitedEmail?: string;
  dueDate?: Date;
}

interface CreateNewInviteResponse {
  userInvite: UserInvite;
}

export class CreateNewInviteUseCase {
  constructor(
    private invitesRepository: IInvitesRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    organizationId,
    creatorId,
    invitedPhone,
    invitedEmail,
    dueDate,
  }: CreateNewInviteRequest): Promise<CreateNewInviteResponse> {
    const creator = await this.usersRepository.findById(creatorId);
    if (!creator) throw new NotFoundError();
    if (creator.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError();

    const cleanedPhone = invitedPhone.replace(/[^0-9]/g, "");
    if (cleanedPhone.length !== 11) throw new InvalidPhoneNumberError();

    if (dueDate && isBefore(dueDate, new Date())) throw new InvalidDateError();

    const userInvite = await this.invitesRepository.create({
      organization: {
        connect: {
          id: organizationId,
        },
      },
      creator: {
        connect: {
          id: creatorId,
        },
      },
      invitedPhone: `${cleanedPhone}`,
      invitedEmail,
      dueDate: dueDate ? dueDate : addDays(new Date(), 3),
    });

    return { userInvite };
  }
}
