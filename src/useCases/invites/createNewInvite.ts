import { IInvitesRepository } from "@/repositories/invites/IInvitesRepository";
import { UserInvite } from "@prisma/client";
import { addDays, isBefore } from "date-fns";
import { InvalidDateError } from "./errors/InvalidDateError";
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
    const cleanedPhone = invitedPhone.replace(/[^0-9]/g, "");
    if (cleanedPhone.length !== 11) throw new InvalidPhoneNumberError();

    if (dueDate && isBefore(dueDate, new Date())) throw new InvalidDateError();

    const userInvite = await this.invitesRepository.create({
      organization: {
        connect: {
          id: organizationId,
        },
      },
      invitedPhone: `${cleanedPhone}`,
      invitedEmail,
      dueDate: dueDate ? dueDate : addDays(new Date(), 3),
    });

    return { userInvite };
  }
}
