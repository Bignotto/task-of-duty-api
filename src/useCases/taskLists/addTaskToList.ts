import { NotFoundError } from "@/globals/errors/NotFoundError";
import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { WrongOrganizationError } from "./errors/WrongOrganizationError";

interface AddTaskToListRequest {
  taskListId: bigint;
  taskId: bigint;
}

export class AddTaskToListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskListId, taskId }: AddTaskToListRequest) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task)
      throw new NotFoundError({
        origin: "AddTaskToListUseCase",
        sub: `taskId:${taskId}`,
      });

    const taskList =
      await this.taskListsRepository.findTaskListById(taskListId);
    if (!taskList)
      throw new NotFoundError({
        origin: "AddTaskToListUseCase",
        sub: `taskListId:${taskListId}`,
      });

    if (task.organizationId !== taskList.organizationId)
      throw new WrongOrganizationError();

    const result = await this.taskListsRepository.addTaskToList(
      taskId,
      taskListId,
    );
    return result;
  }
}
