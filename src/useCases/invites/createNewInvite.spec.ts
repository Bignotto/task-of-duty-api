import { InMemoryInvitesRepository } from "@/repositories/invites/inMemory/inMemoryInvitesRepository";
import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { Organization, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewInviteUseCase } from "./createNewInvite";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneError";

let invitesRepository: InMemoryInvitesRepository;
let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let user: User;
let organization: Organization;

let sut: CreateNewInviteUseCase;

describe("Invite User Use Case", () => {
  beforeEach(async () => {
    invitesRepository = new InMemoryInvitesRepository();
    sut = new CreateNewInviteUseCase(invitesRepository);

    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();

    user = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
    });

    organization = await organizationsRepository.create({
      cnpj: "12345678901234",
      fantasyName: "The Buggle",
      name: "The Daily Buggle",
      owner: {
        connect: {
          id: user.id,
        },
      },
    });
  });

  it("organizations owner should be able to invite users", async () => {
    const { userInvite } = await sut.execute({
      organizationId: organization.id,
      invitedPhone: "12345678901",
    });

    expect(userInvite.id).toEqual(expect.any(String));
  });

  it("should not be able to create an invite without a valid phone number", async () => {
    await expect(() =>
      sut.execute({
        organizationId: organization.id,
        invitedPhone: "12345678",
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneNumberError);
  });
});
