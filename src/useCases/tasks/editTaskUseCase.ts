import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { RecurrenceType, Task, TaskType } from "@prisma/client";

interface EditTaskRequest {
  id: bigint;
  title?: string;
  description?: string;
  recurrenceType?: RecurrenceType;
  taskType?: TaskType;
  dueDate?: Date;
}

interface EditTaskResponse {
  task: Task;
}

export class EditTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    id,
    title,
    description,
    recurrenceType,
    taskType,
    dueDate,
  }: EditTaskRequest): Promise<EditTaskResponse> {
    const task = await this.tasksRepository.updateTask({
      id,
      title,
      description,
      recurrenceType,
      taskType,
      dueDate,
    });

    return { task };
  }
}
