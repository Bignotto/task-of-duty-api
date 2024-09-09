import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationAdminError } from '@/globals/errors/NotOrganizationAdminError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { UserType } from '@prisma/client'

interface DeleteTaskRequest {
  taskId: bigint
  userId: string
}
export class DeleteTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskId, userId }: DeleteTaskRequest) {
    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'DeleteTaskUseCase',
        sub: userId,
      })
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError()

    const task = await this.tasksRepository.findById(taskId)
    if (!task)
      throw new NotFoundError({
        origin: 'DeleteTaskUseCase',
        sub: taskId.toString(),
      })

    if (user.partOfOrganizationId !== task.organizationId)
      throw new NotSameOrganizationError()

    await this.tasksRepository.deleteTask(taskId)
  }
}
