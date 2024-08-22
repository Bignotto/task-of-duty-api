import { NotFoundError } from "@/globals/errors/NotFoundError";
import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeTaskList } from "@/utils/tests/makeTaskList";
import { makeUser } from "@/utils/tests/makeUser";
import { User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { UserNotAssignedError } from "./errors/UserNotAssignedError";
import { UnassignUserListUseCase } from "./unassignUserList";

let user: User;
let usersRepository: InMemoryUsersRepository;
let taskListsRepository: InMemoryTaskListsRepository;

let sut: UnassignUserListUseCase;

describe("Unassign User Task List Use Case", () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository();
    sut = new UnassignUserListUseCase(taskListsRepository);

    usersRepository = new InMemoryUsersRepository();
    user = await makeUser({}, usersRepository);
  });

  it("should be able to unassign a task list of a user", async () => {
    const task = await makeTaskList(
      {
        creatorId: user.id,
        orgId: `${user.partOfOrganizationId}`,
      },
      taskListsRepository,
    );

    const user1 = await makeUser(
      {
        orgId: `${user.partOfOrganizationId}`,
        userType: "USER",
      },
      usersRepository,
    );

    const user2 = await makeUser(
      {
        orgId: `${user.partOfOrganizationId}`,
        userType: "USER",
      },
      usersRepository,
    );

    await taskListsRepository.assignUser(task.id, user1.id);
    await taskListsRepository.assignUser(task.id, user2.id);

    await sut.execute({
      taskListId: task.id,
      userId: user1.id,
    });

    const remaining = await taskListsRepository.getTaskListUsers(task.id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toEqual(user2.id);
  });

  it("should not be able to unassign user from invalid task list", async () => {
    await expect(
      sut.execute({
        taskListId: BigInt(42),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to unassign invalid user from task list", async () => {
    const taskList = await makeTaskList(
      {
        creatorId: user.id,
        orgId: `${user.partOfOrganizationId}`,
      },
      taskListsRepository,
    );

    await expect(
      sut.execute({
        taskListId: taskList.id,
        userId: "wrong user id",
      }),
    ).rejects.toBeInstanceOf(UserNotAssignedError);
  });
});
