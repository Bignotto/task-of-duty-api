import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationAdminError } from '@/globals/errors/NotOrganizationAdminError'
import { ITaskListsRepository } from '@/repositories/taskLists/ITaskListsRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { UserType } from '@prisma/client'
import { AssignmentError } from './errors/AssignmentError'
import { WrongOrganizationError } from './errors/WrongOrganizationError'

interface AssignUserToTaskListRequest {
  assigneeId: string
  taskListId: bigint
  userId: string
}

export class AssignListToUserUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    assigneeId,
    taskListId,
    userId,
  }: AssignUserToTaskListRequest): Promise<boolean> {
    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'AssignListToUserUseCase',
        sub: userId,
      })
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError()

    const assignee = await this.usersRepository.findById(assigneeId)
    if (!assignee)
      throw new NotFoundError({
        origin: 'AssignListToUserUseCase',
        sub: assigneeId,
      })

    const taskList = await this.taskListsRepository.findTaskListById(taskListId)
    if (!taskList)
      throw new NotFoundError({
        origin: 'AssignListToUserUseCase',
        sub: taskListId.toString(),
      })

    if (assignee.partOfOrganizationId !== taskList.organizationId)
      throw new WrongOrganizationError()

    const result = await this.taskListsRepository.assignUser(
      taskListId,
      assigneeId,
    )

    if (!result) throw new AssignmentError()
    return true
  }
}
