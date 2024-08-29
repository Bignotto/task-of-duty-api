import { InvalidDateError } from "@/globals/errors/InvalidDateError";
import { NotFoundError } from "@/globals/errors/NotFoundError";
import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeTask } from "@/utils/tests/makeTask";
import { makeUser } from "@/utils/tests/makeUser";
import { Task, User, UserType } from "@prisma/client";
import { addDays, subDays } from "date-fns";
import { beforeEach, describe, expect, it } from "vitest";
import { EditTaskUseCase } from "./editTaskUseCase";

let user: User;
let task: Task;

let usersRepository: InMemoryUsersRepository;
let tasksRepository: InMemoryTasksRepository;

let sut: EditTaskUseCase;

describe("Edit Task Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    tasksRepository = new InMemoryTasksRepository();

    sut = new EditTaskUseCase(tasksRepository, usersRepository);

    user = await makeUser(
      {
        userType: UserType.ORGANIZATION,
      },
      usersRepository,
    );
  });

  it("should be able to edit a task", async () => {
    const task = await makeTask({}, tasksRepository);

    const { task: editedTask } = await sut.execute({
      id: task.id,
      title: "NEW TITLE",
      description: "NEW DESCRIPTION",
      userId: user.id,
    });

    expect(editedTask.id).toEqual(task.id);
    expect(editedTask.title).toEqual("NEW TITLE");
    expect(editedTask.description).toEqual("NEW DESCRIPTION");
  });

  it("should not be able to update with a past date", async () => {
    const task = await makeTask({}, tasksRepository);

    await expect(
      sut.execute({
        id: task.id,
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
        dueDate: subDays(new Date(), 5),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(InvalidDateError);
  });

  it("should not be able to update an invalid task", async () => {
    await expect(
      sut.execute({
        id: BigInt(42),
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
        dueDate: addDays(new Date(), 5),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should not be able to update a task with an invalid user", async () => {
    const task = await makeTask({}, tasksRepository);

    await expect(
      sut.execute({
        id: task.id,
        title: "NEW TITLE",
        description: "NEW DESCRIPTION",
        dueDate: addDays(new Date(), 5),
        userId: "wrong user id",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
