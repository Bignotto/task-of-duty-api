import { InMemoryTasksRepository } from "@/repositories/tasks/inMemory/inMemoryTasksRepository";
import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { makeTask } from "@/utils/tests/makeTask";
import { makeUser } from "@/utils/tests/makeUser";
import { Task, User } from "@prisma/client";
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

    sut = new EditTaskUseCase(tasksRepository);

    user = await makeUser({}, usersRepository);
  });

  it("should be able to edit a task", async () => {
    const task = await makeTask({}, tasksRepository);

    const { task: editedTask } = await sut.execute({
      id: task.id,
      title: "NEW TITLE",
      description: "NEW DESCRIPTION",
    });

    expect(editedTask.id).toEqual(task.id);
    expect(editedTask.title).toEqual("NEW TITLE");
    expect(editedTask.description).toEqual("NEW DESCRIPTION");
  });
  //NEXT: complete tests
});
