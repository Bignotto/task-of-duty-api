import { NotFoundError } from '@/globals/errors/NotFoundError'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { AssignmentError } from '../taskLists/errors/AssignmentError'
import { UserNotAssignedError } from './errors/UserNotAssignedError'

interface UnassignUserTaskRequest {
  taskId: bigint
  userId: string
}

export class UnassignUserTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ taskId, userId }: UnassignUserTaskRequest) {
    const foundTask = await this.tasksRepository.findById(taskId)
    if (!foundTask)
      throw new NotFoundError({
        origin: 'UnassignUserTaskUseCase',
        sub: taskId.toString(),
      })

    const taskUsers = await this.tasksRepository.getTaskUsers(taskId)
    const userFound = taskUsers.find((u) => u.id === userId)
    if (!userFound) throw new UserNotAssignedError()

    const result = await this.tasksRepository.unassignUser(taskId, userId)
    if (!result) throw new AssignmentError()
  }
}
