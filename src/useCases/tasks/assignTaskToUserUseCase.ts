import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationAdminError } from '@/globals/errors/NotOrganizationAdminError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { UserType } from '@prisma/client'

interface AssignTaskToUserRequest {
  taskId: bigint
  assigneeId: string
  userId: string
}

interface AssignTaskToUserResponse {
  result: boolean
}

export class AssignTaskToUserUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    taskId,
    assigneeId,
    userId,
  }: AssignTaskToUserRequest): Promise<AssignTaskToUserResponse> {
    const assignee = await this.usersRepository.findById(assigneeId)
    if (!assignee)
      throw new NotFoundError({
        origin: 'AssignTaskToUserUseCase',
        sub: 'assignee',
      })
    const task = await this.tasksRepository.findById(taskId)
    if (!task)
      throw new NotFoundError({
        origin: 'AssignTaskToUserUseCase',
        sub: 'task',
      })

    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'AssignTaskToUserUseCase',
        sub: 'user',
      })
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError()

    if (task.organizationId !== assignee.partOfOrganizationId)
      throw new NotSameOrganizationError()

    const result = await this.tasksRepository.assignUser(taskId, assigneeId)
    return { result }
  }
}
