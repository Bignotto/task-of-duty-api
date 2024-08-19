import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotSameOrganizationError } from "@/globals/errors/NotSameOrganizationError";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";

interface AssignTaskToUserRequest {
  taskId: bigint;
  assigneeId: string;
}

interface AssignTaskToUserResponse {
  result: boolean;
}

export class AssignTaskToUserUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    taskId,
    assigneeId,
  }: AssignTaskToUserRequest): Promise<AssignTaskToUserResponse> {
    const assignee = await this.usersRepository.findById(assigneeId);
    if (!assignee)
      throw new NotFoundError({
        origin: "AssignTaskToUserUseCase",
        sub: "assignee",
      });
    const task = await this.tasksRepository.findById(taskId);
    if (!task)
      throw new NotFoundError({
        origin: "AssignTaskToUserUseCase",
        sub: "task",
      });

    if (task.organizationId !== assignee.partOfOrganizationId)
      throw new NotSameOrganizationError();

    const result = await this.tasksRepository.assignUser(taskId, assigneeId);
    return { result };
  }
}
