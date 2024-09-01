import { NotFoundError } from '@/globals/errors/NotFoundError'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { TaskDone } from '@prisma/client'
import { WrongOrganizationError } from './errors/WrongOrganizationError'

interface MarkTaskDoneRequest {
  taskId: bigint
  userId: string
  comments?: string
}

interface MarkTaskDoneResponse {
  taskDone: TaskDone
}

export class MarkTaskDoneUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ taskId, userId, comments }: MarkTaskDoneRequest) {
    const task = await this.tasksRepository.findById(taskId)
    if (!task)
      throw new NotFoundError({
        origin: 'MarkTaskDoneUseCase',
        sub: taskId.toString(),
      })

    const user = await this.usersRepository.findById(userId)
    if (!user)
      throw new NotFoundError({
        origin: 'MarkTaskDoneUseCase',
        sub: userId,
      })

    if (user.partOfOrganizationId !== task.organizationId)
      throw new WrongOrganizationError()

    const taskDone = await this.tasksRepository.markTaskDone({
      comment: comments,
      task: {
        connect: {
          id: taskId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      organization: {
        connect: {
          id: task.organizationId,
        },
      },
    })

    return { taskDone }
  }
}
