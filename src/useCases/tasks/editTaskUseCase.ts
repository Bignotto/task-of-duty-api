import { InvalidDateError } from "@/globals/errors/InvalidDateError";
import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotOrganizationAdminError } from "@/globals/errors/NotOrganizationAdminError";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { RecurrenceType, Task, TaskType, UserType } from "@prisma/client";
import { isBefore } from "date-fns";

interface EditTaskRequest {
  id: bigint;
  title?: string;
  description?: string;
  recurrenceType?: RecurrenceType;
  taskType?: TaskType;
  dueDate?: Date;
  userId: string;
}

interface EditTaskResponse {
  task: Task;
}

export class EditTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    id,
    title,
    description,
    recurrenceType,
    taskType,
    dueDate,
    userId,
  }: EditTaskRequest): Promise<EditTaskResponse> {
    if (dueDate && isBefore(dueDate, new Date())) throw new InvalidDateError();

    const foundUser = await this.usersRepository.findById(userId);
    if (!foundUser)
      throw new NotFoundError({
        origin: "EditTaskUseCase",
        sub: userId,
      });

    if (foundUser.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError();

    const foundTask = await this.tasksRepository.findById(id);
    if (!foundTask)
      throw new NotFoundError({
        origin: "EditTaskUseCase",
        sub: id.toString(),
      });

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
