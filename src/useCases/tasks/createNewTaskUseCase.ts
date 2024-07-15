import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { RecurrenceType, Task, TaskType } from "@prisma/client";

interface CreateNewTaskRequest {
  title: string;
  description: string;
  recurrenceType: RecurrenceType;
  taskType: TaskType;
  creatorId: string;
  dueDate?: Date;
  organizationId?: string;
}

interface CreateNewTaskResponse {
  task: Task;
}

export class CreateNewTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    title,
    description,
    recurrenceType,
    taskType,
    creatorId,
    dueDate,
    organizationId,
  }: CreateNewTaskRequest): Promise<CreateNewTaskResponse> {
    const task = await this.tasksRepository.create({
      title,
      description,
      dueDate,
      creator: { connect: { id: creatorId } },
      recurrenceType,
      taskType,
      organization: { connect: { id: organizationId } },
    });

    return { task };
  }
}
