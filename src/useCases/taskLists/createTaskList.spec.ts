import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { Organization, User, UserType } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateTaskListUseCase } from "./createTaskList";

let user: User;
let organization: Organization;

let taskListsRepository: InMemoryTaskListsRepository;
let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let sut: CreateTaskListUseCase;

describe("Create Task List Use Case", () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository();
    usersRepository = new InMemoryUsersRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreateTaskListUseCase(
      taskListsRepository,
      usersRepository,
      organizationsRepository,
    );

    user = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
      userType: UserType.ORGANIZATION,
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

  it("should be able to create a new task list", async () => {
    const { list } = await sut.execute({
      creatorId: user.id,
      description: "Get a first page history step by step.",
      title: "First Page",
      organizationId: organization.id,
    });

    expect(list.id).toEqual(expect.any(BigInt));
  });

  it("should be able to create a new task list linked with an organization", async () => {
    const organizationsRepository = new InMemoryOrganizationsRepository();
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
    const { list } = await sut.execute({
      creatorId: user.id,
      description: "Get a first page history step by step.",
      title: "First Page",
      organizationId: organization.id,
    });

    expect(list.id).toEqual(expect.any(BigInt));
    expect(list.organizationId).toEqual(expect.any(String));
    expect(list.organizationId?.length).toBeGreaterThan(0);
  });
  //TODO: test for invalid creator id, invalid organization id, invalid due date, not part of organization
});
