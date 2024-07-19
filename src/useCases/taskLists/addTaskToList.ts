import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";

interface AddTaskToListRequest {
  taskListId: BigInt;
  taskId: BigInt;
}

export class AddTaskToListUseCase {
  constructor(private taskListsRepository: ITaskListsRepository) {}

  async execute({ taskListId, taskId }: AddTaskToListRequest) {}
}
