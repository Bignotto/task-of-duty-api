import { IInvitesRepository } from "@/repositories/invites/IInvitesRepository";
import { UserInvite } from "@prisma/client";

interface CreateNewInviteRequest {
  organizationId: string;
  inviteUserId: string;
  dueDate?: Date;
}

interface CreateNewInviteResponse {
  userInvite: UserInvite;
}

export class CreateNewInviteUseCase {
  constructor(private invitesRepository: IInvitesRepository) {}

  async execute({
    organizationId,
    inviteUserId,
    dueDate,
  }: CreateNewInviteRequest): Promise<CreateNewInviteResponse> {
    const userInvite = await this.invitesRepository.create({
      organization: {
        connect: {
          id: organizationId,
        },
      },
      user: {
        connect: {
          id: inviteUserId,
        },
      },
      dueDate,
    });

    return { userInvite };
  }
}
