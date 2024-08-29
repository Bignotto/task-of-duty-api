import { NotFoundError } from "@/globals/errors/NotFoundError";
import { NotOrganizationAdminError } from "@/globals/errors/NotOrganizationAdminError";
import { NotSameOrganizationError } from "@/globals/errors/NotSameOrganizationError";
import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { TaskList } from "@prisma/client";

interface EditTaskListRequest {
  id: bigint;
  userId: string;
  title?: string;
  description?: string;
}

interface EditTaskListResponse {
  taskList: TaskList;
}
export class EditTaskListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    id,
    userId,
    title,
    description,
  }: EditTaskListRequest): Promise<EditTaskListResponse> {
    const foundTaskList = await this.taskListsRepository.findTaskListById(id);
    if (!foundTaskList)
      throw new NotFoundError({
        origin: "EditTaskListUseCase",
        sub: id.toString(),
      });

    const foundUser = await this.usersRepository.findById(userId);
    if (!foundUser)
      throw new NotFoundError({
        origin: "EditTaskListUseCase",
        sub: userId,
      });

    if (foundUser.userType !== "ORGANIZATION")
      throw new NotOrganizationAdminError();
    if (foundUser.partOfOrganizationId !== foundTaskList.organizationId)
      throw new NotSameOrganizationError();

    const taskList = await this.taskListsRepository.updateTaskList({
      id,
      title,
      description,
    });

    return { taskList };
  }
}
