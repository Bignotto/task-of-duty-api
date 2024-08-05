import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotSameOrganizationError } from "@/globals/errors/NotSameOrganizationError";
import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { RecurrenceType, Task, TaskType, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { AssignTaskToUserUseCase } from "./assignTaskToUserUseCase";

let usersRepository: InMemoryUsersRepository;
let tasksRepository: InMemoryTasksRepository;

let userOwner: User;
let userA: User;
let userB: User;

let task1: Task;
let task2: Task;
let task3: Task;

let sut: AssignTaskToUserUseCase;

describe("Assign Tasks to Users Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    tasksRepository = new InMemoryTasksRepository();

    sut = new AssignTaskToUserUseCase(tasksRepository, usersRepository);

    userOwner = await usersRepository.create({
      email: "jj@dailybuggle.com",
      name: "J Jonah Jameson",
      passwordHash: "hashed_password",
      userType: "ORGANIZATION",
    });

    userA = await usersRepository.create({
      email: "mj@dailybuggle.com",
      name: "Mary Jane",
      passwordHash: "hashed_password",
      userType: "USER",
      partOfOrganization: {
        connect: {
          id: "some org id",
        },
      },
    });
    userB = await usersRepository.create({
      email: "pp@dailybuggle.com",
      name: "Peter Parker",
      passwordHash: "hashed_password",
      userType: "USER",
      partOfOrganization: {
        connect: {
          id: "some org id",
        },
      },
    });

    task1 = await tasksRepository.create({
      title: "Photo",
      description: "Get a good photo!",
      taskType: TaskType.TASK,
      recurrenceType: RecurrenceType.EXACT,
      creator: {
        connect: {
          id: userOwner.id,
        },
      },
      organization: {
        connect: {
          id: "some org id",
        },
      },
    });

    task2 = await tasksRepository.create({
      title: "Story",
      description: "Get a good story!",
      taskType: TaskType.TASK,
      recurrenceType: RecurrenceType.EXACT,
      creator: {
        connect: {
          id: userOwner.id,
        },
      },
      organization: {
        connect: {
          id: "some org id",
        },
      },
    });

    task3 = await tasksRepository.create({
      title: "First Page",
      description: "Get a first page!",
      taskType: TaskType.TASK,
      recurrenceType: RecurrenceType.EXACT,
      creator: {
        connect: {
          id: userOwner.id,
        },
      },
      organization: {
        connect: {
          id: "some org id",
        },
      },
    });
  });

  it("should be able to assign user a task", async () => {
    const { result } = await sut.execute({
      assigneeId: userA.id,
      taskId: task1.id,
    });

    expect(result).toBe(true);
  });

  it("should not be able to assign user a task from different organization", async () => {
    const otherOrganizationTask = await tasksRepository.create({
      title: "Story",
      description: "Get a good story!",
      taskType: TaskType.TASK,
      recurrenceType: RecurrenceType.EXACT,
      creator: {
        connect: {
          id: userOwner.id,
        },
      },
      organization: {
        connect: {
          id: "some other org id",
        },
      },
    });

    await expect(
      sut.execute({
        assigneeId: userA.id,
        taskId: otherOrganizationTask.id,
      }),
    ).rejects.toBeInstanceOf(NotSameOrganizationError);
  });

  it("should be possible to assign more than one user to a task", async () => {
    const { result: resultA } = await sut.execute({
      assigneeId: userA.id,
      taskId: task1.id,
    });

    const { result: resultB } = await sut.execute({
      assigneeId: userB.id,
      taskId: task1.id,
    });

    expect(resultA).toBe(true);
    expect(resultB).toBe(true);
  });

  it("should not be possible to assign invalid user a task", async () => {
    await expect(
      sut.execute({
        assigneeId: "invalid user",
        taskId: task1.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to assign user an invalid task", async () => {
    await expect(
      sut.execute({
        assigneeId: userA.id,
        taskId: BigInt(55),
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
}); //describe
