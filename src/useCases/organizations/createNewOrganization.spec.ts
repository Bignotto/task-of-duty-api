import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewOrganizationUseCase } from "./createNewOrganization";

let organizationsRepository: InMemoryOrganizationsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateNewOrganizationUseCase;

describe("Create New Organization Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreateNewOrganizationUseCase(organizationsRepository);
  });

  it("should be able to create a new organization", async () => {
    const user = await usersRepository.create({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      passwordHash: await hash("123456", 6),
    });

    const { organization } = await sut.execute({
      cnpj: "51049401000177",
      fantasyName: "Bugle",
      name: "Daily Bugle",
      ownerId: user.id,
    });

    expect(organization.id).toEqual(expect.any(String));
  });
});
