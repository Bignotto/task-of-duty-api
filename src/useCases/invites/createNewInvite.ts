import { IInvitesRepository } from "@/repositories/invites/IInvitesRepository";
import { UserInvite } from "@prisma/client";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneError";

interface CreateNewInviteRequest {
  organizationId: string;
  invitedPhone: string;
  invitedEmail?: string;
  dueDate?: Date;
}

interface CreateNewInviteResponse {
  userInvite: UserInvite;
}

export class CreateNewInviteUseCase {
  constructor(private invitesRepository: IInvitesRepository) {}

  async execute({
    organizationId,
    invitedPhone,
    invitedEmail,
    dueDate,
  }: CreateNewInviteRequest): Promise<CreateNewInviteResponse> {
    if (invitedPhone.length !== 11) throw new InvalidPhoneNumberError();

    const userInvite = await this.invitesRepository.create({
      organization: {
        connect: {
          id: organizationId,
        },
      },
      invitedPhone,
      invitedEmail,
      dueDate,
    });

    return { userInvite };
  }
}
