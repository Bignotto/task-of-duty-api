import { InMemoryInvitesRepository } from "@/repositories/invites/inMemory/inMemoryInvitesRepository";
import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewInviteUseCase } from "./createNewInvite";

let invitesRepository: InMemoryInvitesRepository;
let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;

let sut: CreateNewInviteUseCase;

describe("Invte User Use Case", () => {
  beforeEach(() => {
    invitesRepository = new InMemoryInvitesRepository();
    sut = new CreateNewInviteUseCase(invitesRepository);

    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
  });

  it("organizations owner should be able to invite users", async () => {
    const user = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
    });

    const organization = await organizationsRepository.create({
      cnpj: "12345678901234",
      fantasyName: "The Buggle",
      name: "The Daily Buggle",
      owner: {
        connect: {
          id: user.id,
        },
      },
    });

    const { userInvite } = await sut.execute({
      organizationId: organization.id,
      invitedPhone: "12-2345-6789",
    });

    expect(userInvite.id).toEqual(expect.any(String));
  });
});
