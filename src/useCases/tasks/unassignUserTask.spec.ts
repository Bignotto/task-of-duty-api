import { NotFoundError } from "@/globals/errors/NotFoundError";
import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeTask } from "@/utils/tests/makeTask";
import { makeUser } from "@/utils/tests/makeUser";
import { User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { UserNotAssignedError } from "./errors/UserNotAssignedError";
import { UnassignUserTaskUseCase } from "./unassignUserTask";

let user: User;

let usersRepository: InMemoryUsersRepository;
let tasksRepository: InMemoryTasksRepository;

let sut: UnassignUserTaskUseCase;

describe("Unassign User Task Use Case", () => {
  beforeEach(async () => {
    tasksRepository = new InMemoryTasksRepository();
    sut = new UnassignUserTaskUseCase(tasksRepository);

    usersRepository = new InMemoryUsersRepository();
    user = await makeUser({}, usersRepository);
  });

  it("should be able to unassign a task of a user", async () => {
    const task = await makeTask(
      {
        creatorId: user.id,
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
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

    await tasksRepository.assignUser(task.id, user1.id);
    await tasksRepository.assignUser(task.id, user2.id);

    await sut.execute({
      taskId: task.id,
      userId: user1.id,
    });

    const remaining = await tasksRepository.getTaskUsers(task.id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toEqual(user2.id);
  });

  it("should not be able to unassign user from invalid task", async () => {
    await expect(
      sut.execute({
        taskId: BigInt(42),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to unassign invalid user from task", async () => {
    const task = await makeTask(
      {
        creatorId: user.id,
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
    );

    await expect(
      sut.execute({
        taskId: task.id,
        userId: "wrong user id",
      }),
    ).rejects.toBeInstanceOf(UserNotAssignedError);
  });
});
