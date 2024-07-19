import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { NotFoundError } from "./errors/NotFoundError";

interface AddTaskToListRequest {
  taskListId: bigint;
  taskId: bigint;
}

export class AddTaskToListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private tasksRepository: ITasksRepository,
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

    const result = await this.taskListsRepository.addTaskToList(
      taskId,
      taskListId,
    );
    return result;
  }
}
