import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { TaskList, UserType } from "@prisma/client";
import { NotFoundError } from "./errors/NotFoundError";
import { NotOrganizationAdminError } from "./errors/NotOrganizationAdminError";

interface CreateTaskListUseCaseRequest {
  title: string;
  description: string;
  creatorId: string;
  organizationId?: string;
}

interface CreateTaskListUseCaseResponse {
  list: TaskList;
}

export class CreateTaskListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    title,
    description,
    creatorId,
    organizationId,
  }: CreateTaskListUseCaseRequest): Promise<CreateTaskListUseCaseResponse> {
    const user = await this.usersRepository.findById(creatorId);
    if (!user)
      throw new NotFoundError({
        origin: "CreateTaskListUseCase",
        sub: creatorId,
      });
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError();

    const list = await this.taskListsRepository.create({
      title,
      description,
      creator: { connect: { id: creatorId } },
      organization: organizationId
        ? { connect: { id: organizationId } }
        : undefined,
    });

    return { list };
  }
}
