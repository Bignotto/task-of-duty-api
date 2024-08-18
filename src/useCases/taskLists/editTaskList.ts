import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { TaskList } from "@prisma/client";

interface EditTaskListRequest {
  id: bigint;
  title?: string;
  description?: string;
}

interface EditTaskListResponse {
  taskList: TaskList;
}
export class EditTaskListUseCase {
  constructor(private taskListsRepository: ITaskListsRepository) {}

  async execute({
    id,
    title,
    description,
  }: EditTaskListRequest): Promise<EditTaskListResponse> {
    const taskList = await this.taskListsRepository.updateTaskList({
      id,
      title,
      description,
    });

    return { taskList };
  }
}
