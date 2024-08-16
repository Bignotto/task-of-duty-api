import { InvalidDateError } from "@/globals/errors/InvalidDateError";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { RecurrenceType, Task, TaskType } from "@prisma/client";
import { isBefore } from "date-fns";

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
    if (dueDate && isBefore(dueDate, new Date())) throw new InvalidDateError();

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
