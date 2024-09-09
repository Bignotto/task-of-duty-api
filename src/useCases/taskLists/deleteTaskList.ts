import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationAdminError } from '@/globals/errors/NotOrganizationAdminError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { ITaskListsRepository } from '@/repositories/taskLists/ITaskListsRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { UserType } from '@prisma/client'

interface DeleteTaskListRequest {
  taskListId: bigint
  userId: string
}

export class DeleteTaskListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskListId, userId }: DeleteTaskListRequest) {
    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'DeleteTaskListUseCase',
        sub: userId,
      })
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError()

    const taskList = await this.taskListsRepository.findTaskListById(taskListId)
    if (!taskList)
      throw new NotFoundError({
        origin: 'DeleteTaskListUseCase',
        sub: taskListId.toString(),
      })

    if (user.partOfOrganizationId !== taskList.organizationId)
      throw new NotSameOrganizationError()

    await this.taskListsRepository.deleteTaskList(taskListId)
  }
}
