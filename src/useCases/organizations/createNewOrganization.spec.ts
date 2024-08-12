import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { UserType } from "@prisma/client";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewOrganizationUseCase } from "./createNewOrganization";
import { CnpjAlreadyInUseError } from "./errors/CnpjAlreadyInUseError";
import { CnpjLengthError } from "./errors/CnpjLengthError";

let organizationsRepository: InMemoryOrganizationsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateNewOrganizationUseCase;

describe("Create New Organization Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreateNewOrganizationUseCase(
      organizationsRepository,
      usersRepository,
    );
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

  it("should not be able to create a new organization with same cnpj", async () => {
    const user = await usersRepository.create({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      passwordHash: await hash("123456", 6),
    });

    await sut.execute({
      cnpj: "51049401000177",
      fantasyName: "Bugle",
      name: "Daily Bugle",
      ownerId: user.id,
    });

    await expect(() =>
      sut.execute({
        cnpj: "51049401000177",
        fantasyName: "Bugle",
        name: "Daily Bugle",
        ownerId: user.id,
      }),
    ).rejects.toBeInstanceOf(CnpjAlreadyInUseError);
  });

  it("should not be able to create new organization with cnpj length invalid", async () => {
    const user = await usersRepository.create({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      passwordHash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        cnpj: "5104940100017",
        fantasyName: "Bugle",
        name: "Daily Bugle",
        ownerId: user.id,
      }),
    ).rejects.toBeInstanceOf(CnpjLengthError);

    await expect(() =>
      sut.execute({
        cnpj: "510494010001778",
        fantasyName: "Bugle",
        name: "Daily Bugle",
        ownerId: user.id,
      }),
    ).rejects.toBeInstanceOf(CnpjLengthError);
  });

  it("should update user type when registering a new organization as the owner", async () => {
    const user = await usersRepository.create({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      passwordHash: await hash("123456", 6),
    });

    await sut.execute({
      cnpj: "51049401000177",
      fantasyName: "Bugle",
      name: "Daily Bugle",
      ownerId: user.id,
    });

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.userType).toEqual(UserType.ORGANIZATION);
  });

  it("should update user organization when registering a new organization as the owner", async () => {
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

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.partOfOrganizationId).toEqual(organization.id);
  });
});
