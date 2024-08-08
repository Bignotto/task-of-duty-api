import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeOrg } from "@/utils/tests/makeOrg";
import { makeUser } from "@/utils/tests/makeUser";
import { TaskList, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { AssignListToUserUseCase } from "./assignListToUser";

let taskListsRepository: InMemoryTaskListsRepository;
let usersRepository: InMemoryUsersRepository;

let taskList: TaskList;
let user: User;

let sut: AssignListToUserUseCase;

describe("Assign TaskList to User", () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository();
    usersRepository = new InMemoryUsersRepository();

    sut = new AssignListToUserUseCase(taskListsRepository, usersRepository);

    user = await makeUser({}, usersRepository);

    const organizationsRepository = new InMemoryOrganizationsRepository();
    const organization = await makeOrg(
      {
        ownerId: user.id,
      },
      organizationsRepository,
    );
  });

  it("should be able to assign task list to user", () => {
    //NEXT: finish tests
    expect(true).toBe(true);
  });
});
