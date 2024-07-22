import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { RecurrenceType, Task, TaskType, UserType } from "@prisma/client";
import { NotFoundError } from "./errors/NotFoundError";
import { NotOrganizationOwnerError } from "./errors/NotOrganizationOwnerError";

interface CreateNewTaskRequest {
  title: string;
  description: string;
  recurrenceType: RecurrenceType;
  taskType: TaskType;
  creatorId: string;
  dueDate?: Date;
  organizationId: string;
}

interface CreateNewTaskResponse {
  task: Task;
}

export class CreateNewTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    title,
    description,
    recurrenceType,
    taskType,
    creatorId,
    dueDate,
    organizationId,
  }: CreateNewTaskRequest): Promise<CreateNewTaskResponse> {
    const creator = await this.usersRepository.findById(creatorId);
    if (!creator)
      throw new NotFoundError({
        origin: "CreateNewTaskUseCase",
        sub: creatorId,
      });

    if (creator.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationOwnerError({
        origin: "CreateNewTaskUseCase",
      });

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
