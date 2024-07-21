import { InviteStatus, Prisma, UserInvite } from "@prisma/client";
import { addDays } from "date-fns";
import { randomUUID } from "node:crypto";
import { IInvitesRepository } from "../IInvitesRepository";

export class InMemoryInvitesRepository implements IInvitesRepository {
  public items: UserInvite[] = [];

  async create(data: Prisma.UserInviteCreateInput) {
    const invite: UserInvite = {
      id: randomUUID(),
      organizationId: `${data.organization.connect?.id}`,
      dueDate: data.dueDate ? new Date(data.dueDate) : addDays(new Date(), 3),
      invitedEmail: `${data.invitedEmail}`,
      invitedPhone: data.invitedPhone,
      createDate: new Date(),
      status: InviteStatus.OPEN,
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
