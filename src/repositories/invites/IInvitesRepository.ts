import { Prisma, UserInvite } from "@prisma/client";

export interface IInvitesRepository {
  create(data: Prisma.UserInviteCreateInput): Promise<UserInvite>;
  findById(id: string): Promise<UserInvite | null>;
}
