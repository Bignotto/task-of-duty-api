import { NotFoundError } from "@/globals/errors/NotFoundError";
import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { AssignmentError } from "./errors/AssignmentError";
import { WrongOrganizationError } from "./errors/WrongOrganizationError";

interface AssignUserToTaskListRequest {
  userId: string;
  taskListId: bigint;
}

export class AssignListToUserUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, taskListId }: AssignUserToTaskListRequest) {
    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new NotFoundError({
        origin: "AssignListToUserUseCase",
        sub: userId,
      });

    const taskList =
      await this.taskListsRepository.findTaskListById(taskListId);
    if (!taskList)
      throw new NotFoundError({
        origin: "AssignListToUserUseCase",
        sub: taskListId.toString(),
      });

    if (user.partOfOrganizationId !== taskList.organizationId)
      throw new WrongOrganizationError();

    const result = await this.taskListsRepository.assignUser(
      taskListId,
      userId,
    );

    if (!result) throw new AssignmentError();
  }
}
