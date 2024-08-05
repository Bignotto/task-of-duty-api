import { NotFoundError } from "@/globals/errors/NotFoundError";
import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import {
  Organization,
  RecurrenceType,
  Task,
  TaskType,
  User,
  UserType,
} from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { AddTaskToListUseCase } from "./addTaskToList";
import { WrongOrganizationError } from "./errors/WrongOrganizationError";

let usersRepository: InMemoryUsersRepository;
let tasksRepository: InMemoryTasksRepository;
let organizationsRepository: InMemoryOrganizationsRepository;

let user: User;
let task1: Task;
let task2: Task;
let organization: Organization;

let taskListsRepository: InMemoryTaskListsRepository;
let sut: AddTaskToListUseCase;

describe("Add Task to Task List Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    tasksRepository = new InMemoryTasksRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();

    taskListsRepository = new InMemoryTaskListsRepository();
    sut = new AddTaskToListUseCase(
      taskListsRepository,
      tasksRepository,
      usersRepository,
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

    task1 = await tasksRepository.create({
      title: "Photo",
      description: "Get a good photo!",
      taskType: TaskType.TASK,
      recurrenceType: RecurrenceType.EXACT,
      creator: {
        connect: {
          id: user.id,
        },
      },
      organization: {
        connect: {
          id: organization.id,
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
          id: user.id,
        },
      },
      organization: {
        connect: {
          id: organization.id,
        },
      },
    });
  });

  it("should be able to add a task to a task list", async () => {
    const taskList = await taskListsRepository.create({
      title: "Get First Page",
      description: "Get my very first First Page of Daily Buggle",
      creator: {
        connect: {
          id: user.id,
        },
      },
      organization: {
        connect: {
          id: organization.id,
        },
      },
    });

    await expect(
      sut.execute({
        taskId: task1.id,
        taskListId: taskList.id,
      }),
    ).resolves.toBe(taskList);
  });

  it("should not be able to add an non existing task to a list", async () => {
    const taskList = await taskListsRepository.create({
      title: "Get First Page",
      description: "Get my very first First Page of Daily Buggle",
      creator: {
        connect: {
          id: user.id,
        },
      },
    });

    await expect(
      sut.execute({
        taskId: BigInt(2405),
        taskListId: taskList.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to add a task to a non existing list", async () => {
    await expect(
      sut.execute({
        taskId: task2.id,
        taskListId: BigInt(2405),
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to add task to a task list of other organization", async () => {
    const organization2 = await organizationsRepository.create({
      cnpj: "12345678901234",
      fantasyName: "The Buggle",
      name: "The Daily Buggle",
      owner: {
        connect: {
          id: user.id,
        },
      },
    });

    const otherTaskList = await taskListsRepository.create({
      title: "Get First Page",
      description: "Get my very first First Page of Daily Buggle",
      creator: {
        connect: {
          id: user.id,
        },
      },
      organization: {
        connect: {
          id: organization2.id,
        },
      },
    });

    await expect(
      sut.execute({
        taskId: task2.id,
        taskListId: otherTaskList.id,
      }),
    ).rejects.toBeInstanceOf(WrongOrganizationError);
  });
}); //describe
