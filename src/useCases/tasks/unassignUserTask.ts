import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { AssignmentError } from "../taskLists/errors/AssignmentError";

interface UnassignUserTaskRequest {
  taskId: bigint;
  userId: string;
}

export class UnassignUserTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ taskId, userId }: UnassignUserTaskRequest) {
    const result = await this.tasksRepository.unassignUser(taskId, userId);
    if (!result) throw new AssignmentError();
  }
}
