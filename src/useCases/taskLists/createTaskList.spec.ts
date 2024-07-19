import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateTaskListUseCase } from "./createTaskList";

let user: User;

let taskListsRepository: InMemoryTaskListsRepository;
let sut: CreateTaskListUseCase;

describe("Create Task List Use Case", () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository();
    sut = new CreateTaskListUseCase(taskListsRepository);

    let usersRepository: InMemoryUsersRepository;
    usersRepository = new InMemoryUsersRepository();

    user = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
    });
  });

  it("should be able to create a new task list", async () => {
    const { list } = await sut.execute({
      creatorId: user.id,
      description: "Get a first page history step by step.",
      title: "First Page",
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
});
