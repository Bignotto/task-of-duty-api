import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";

interface GetTaskRequest {
  taskId: bigint
}

export class GetTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository
  ) { }

  async execute({ taskId }: GetTaskRequest) {
    const task = await this.tasksRepository.findById(taskId)

    return { task }
  }
}