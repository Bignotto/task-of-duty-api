import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotSameOrganizationError } from "@/globals/errors/NotSameOrganizationError";
import { ITasksRepository } from "@/repositories/tasks/ITasksRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";

interface DeleteTaskRequest {
  taskId: bigint;
  userId: string;
}
export class DeleteTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskId, userId }: DeleteTaskRequest) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task)
      throw new NotFoundError({
        origin: "DeleteTaskUseCase",
        sub: taskId.toString(),
      });

    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new NotFoundError({
        origin: "DeleteTaskUseCase",
        sub: userId,
      });

    if (user.partOfOrganizationId !== task.organizationId)
      throw new NotSameOrganizationError();

    await this.tasksRepository.deleteTask(taskId);
  }
}
