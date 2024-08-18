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

    sut = new EditTaskListUseCase(taskListsRepository);

    user = await makeUser({}, usersRepository);
  });

  it("should be able to edit a task list", async () => {
    const task = await makeTaskList({}, taskListsRepository);

    const { taskList: editedTaskList } = await sut.execute({
      id: task.id,
      title: "NEW TITLE",
      description: "NEW DESCRIPTION",
    });

    expect(editedTaskList.id).toEqual(task.id);
    expect(editedTaskList.title).toEqual("NEW TITLE");
    expect(editedTaskList.description).toEqual("NEW DESCRIPTION");
  });
});
