import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeOrg } from "@/utils/tests/makeOrg";
import { makeTaskList } from "@/utils/tests/makeTaskList";
import { makeUser } from "@/utils/tests/makeUser";
import { Organization, TaskList, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { AssignListToUserUseCase } from "./assignListToUser";

let taskListsRepository: InMemoryTaskListsRepository;
let usersRepository: InMemoryUsersRepository;
let organizationsRepository: InMemoryOrganizationsRepository;

let taskList: TaskList;
let user: User;
let organization: Organization;

let sut: AssignListToUserUseCase;

describe("Assign TaskList to User", () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository();
    usersRepository = new InMemoryUsersRepository();

    sut = new AssignListToUserUseCase(taskListsRepository, usersRepository);

    user = await makeUser({}, usersRepository);

    organizationsRepository = new InMemoryOrganizationsRepository();
    organization = await makeOrg(
      {
        ownerId: user.id,
      },
      organizationsRepository,
    );

    taskList = await makeTaskList(
      {
        creatorId: user.id,
        orgId: organization.id,
      },
      taskListsRepository,
    );
  });

  it("should be able to assign task list to user", async () => {
    const newUser = await makeUser(
      {
        orgId: organization.id,
      },
      usersRepository,
    );

    const result = await sut.execute({
      taskListId: taskList.id,
      userId: newUser.id,
    });
    expect(result).toBe(true);
  });

  it("should be able to assign more than one tasklist to same user", async () => {
    const newUser = await makeUser(
      {
        orgId: organization.id,
      },
      usersRepository,
    );

    const newTaskList = await makeTaskList(
      {
        creatorId: user.id,
        orgId: organization.id,
      },
      taskListsRepository,
    );

    await sut.execute({
      taskListId: taskList.id,
      userId: newUser.id,
    });

    const result = await sut.execute({
      taskListId: newTaskList.id,
      userId: newUser.id,
    });

    expect(result).toBe(true);
  });
});
