import { NotFoundError } from "@/globals/errors/NotFoundError";
import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
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
    //validate user
    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new NotFoundError({
        origin: "AssignListToUserUseCase",
        sub: userId,
      });

    //validate tasklist
    const taskList =
      await this.taskListsRepository.findTaskListById(taskListId);
    if (!taskList)
      throw new NotFoundError({
        origin: "AssignListToUserUseCase",
        sub: taskListId.toString(),
      });

    //validate same org user tasklist
    if (user.partOfOrganizationId !== taskList.organizationId)
      throw new WrongOrganizationError();

    //assign tasklist to user
    //NEXT: implement function in repository
  }
}
