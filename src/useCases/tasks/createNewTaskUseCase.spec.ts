import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import {
  Organization,
  RecurrenceType,
  TaskType,
  User,
  UserType,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewTaskUseCase } from "./createNewTaskUseCase";
import { NotOrganizationOwnerError } from "./errors/NotOrganizationOwnerError";

let tasksRepository: InMemoryTasksRepository;
let sut: CreateNewTaskUseCase;

let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let user: User;
let organization: Organization;

describe("Create New Task Use Case", () => {
  beforeEach(async () => {
    tasksRepository = new InMemoryTasksRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateNewTaskUseCase(tasksRepository, usersRepository);

    organizationsRepository = new InMemoryOrganizationsRepository();

    user = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
      userType: "ORGANIZATION",
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

  it("should be able to create a new task", async () => {
    const { task } = await sut.execute({
      creatorId: user.id,
      description: "Get a good news to get a first page!",
      title: "Find a story",
      recurrenceType: RecurrenceType.WEEKLY,
      taskType: TaskType.TASK,
      organizationId: organization.id,
    });

    expect(task.id).toEqual(expect.any(BigInt));
  });

  it("only organization owners can create a new task", async () => {
    const newUser = await usersRepository.create({
      id: randomUUID(),
      email: "jjjameson@dailybuggle.com",
      name: "JJ Jameson",
      passwordHash: "some hashed password",
      userType: UserType.USER,
    });

    await expect(
      sut.execute({
        creatorId: newUser.id,
        description: "Get a good news to get a first page!",
        title: "Find a story",
        recurrenceType: RecurrenceType.WEEKLY,
        taskType: TaskType.TASK,
        organizationId: organization.id,
      }),
    ).rejects.toBeInstanceOf(NotOrganizationOwnerError);
  });
});
