import { Prisma, UserInvite } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { IInvitesRepository } from "../IInvitesRepository";

export class InMemoryInvitesRepository implements IInvitesRepository {
  public items: UserInvite[] = [];

  async create(data: Prisma.UserInviteCreateInput) {
    const invite: UserInvite = {
      id: randomUUID(),
      organizationId: `${data.organization.connect?.id}`,
      dueDate: null,
      invitedEmail: `${data.invitedEmail}`,
      invitedPhone: data.invitedPhone,
      createDate: new Date(),
    };
    this.items.push(invite);

    return invite;
  }

  async findById(id: string) {
    const invite = this.items.find((item) => item.id === id);

    if (!invite) return null;

    return invite;
  }
}
