import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationAdminError } from '@/globals/errors/NotOrganizationAdminError'
import { ITaskListsRepository } from '@/repositories/taskLists/ITaskListsRepository'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { UserType } from '@prisma/client'
import { WrongOrganizationError } from './errors/WrongOrganizationError'

interface AddTaskToListRequest {
  taskListId: bigint
  taskId: bigint
  userId: string
}

export class AddTaskToListUseCase {
  constructor(
    private taskListsRepository: ITaskListsRepository,
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskListId, taskId, userId }: AddTaskToListRequest) {
    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'AddTaskToListUseCase',
        sub: `userId:${userId}`,
      })
    if (user.userType !== UserType.ORGANIZATION)
      throw new NotOrganizationAdminError()

    const task = await this.tasksRepository.findById(taskId)
    if (!task)
      throw new NotFoundError({
        origin: 'AddTaskToListUseCase',
        sub: `taskId:${taskId}`,
      })

    const taskList = await this.taskListsRepository.findTaskListById(taskListId)
    if (!taskList)
      throw new NotFoundError({
        origin: 'AddTaskToListUseCase',
        sub: `taskListId:${taskListId}`,
      })

    if (task.organizationId !== taskList.organizationId)
      throw new WrongOrganizationError()

    const result = await this.taskListsRepository.addTaskToList(
      taskId,
      taskListId,
    )
    return result
  }
}
