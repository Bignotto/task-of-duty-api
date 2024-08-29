import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotOrganizationAdminError } from "@/globals/errors/NotOrganizationAdminError";
import { NotSameOrganizationError } from "@/globals/errors/NotSameOrganizationError";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeTaskList } from "@/utils/tests/makeTaskList";
import { makeUser } from "@/utils/tests/makeUser";
import { Task, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { EditTaskListUseCase } from "./editTaskList";

let user: User;
let task: Task;

let usersRepository: InMemoryUsersRepository;
let taskListsRepository: InMemoryTaskListsRepository;

let sut: EditTaskListUseCase;

describe("Edit Task Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    taskListsRepository = new InMemoryTaskListsRepository();

    sut = new EditTaskListUseCase(taskListsRepository, usersRepository);

    user = await makeUser(
      {
        userType: "ORGANIZATION",
        orgId: "FAKE ORG ID",
      },
      usersRepository,
    );
  });

  it("should be able to edit a task list", async () => {
    const taskList = await makeTaskList(
      {
        orgId: "FAKE ORG ID",
      },
      taskListsRepository,
    );

    const { taskList: editedTaskList } = await sut.execute({
      id: taskList.id,
      userId: user.id,
      title: "NEW TITLE",
      description: "NEW DESCRIPTION",
    });

    expect(editedTaskList.id).toEqual(taskList.id);
    expect(editedTaskList.title).toEqual("NEW TITLE");
    expect(editedTaskList.description).toEqual("NEW DESCRIPTION");
  });

  it("should not be able to edit an invalid task list", async () => {
    await expect(
      sut.execute({
        id: BigInt(42),
        userId: user.id,
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to edit an a task list from another organization", async () => {
    const taskList = await makeTaskList({}, taskListsRepository);

    await expect(
      sut.execute({
        id: taskList.id,
        userId: user.id,
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
      }),
    ).rejects.toBeInstanceOf(NotSameOrganizationError);
  });

  it("should not be able to edit an a task list not being organization admin", async () => {
    const otherUser = await makeUser(
      {
        orgId: "FAKE ORG ID",
        userType: "USER",
      },
      usersRepository,
    );

    const taskList = await makeTaskList(
      {
        orgId: "FAKE ORG ID",
      },
      taskListsRepository,
    );

    await expect(
      sut.execute({
        id: taskList.id,
        userId: otherUser.id,
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
      }),
    ).rejects.toBeInstanceOf(NotOrganizationAdminError);
  });
});
