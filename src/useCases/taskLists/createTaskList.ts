import { ITaskListsRepository } from "@/repositories/taskLists/ITaskListsRepository";
import { TaskList } from "@prisma/client";

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
  constructor(private taskListsRepository: ITaskListsRepository) {}

  async execute({
    title,
    description,
    creatorId,
    organizationId,
  }: CreateTaskListUseCaseRequest): Promise<CreateTaskListUseCaseResponse> {
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
