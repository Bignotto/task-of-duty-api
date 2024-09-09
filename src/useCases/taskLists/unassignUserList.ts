import { NotFoundError } from '@/globals/errors/NotFoundError'
import { ITaskListsRepository } from '@/repositories/taskLists/ITaskListsRepository'
import { AssignmentError } from './errors/AssignmentError'
import { UserNotAssignedError } from './errors/UserNotAssignedError'

interface UnassignUserListRequest {
  taskListId: bigint
  userId: string
}

export class UnassignUserListUseCase {
  constructor(private taskListsRepository: ITaskListsRepository) {}

  async execute({ taskListId, userId }: UnassignUserListRequest) {
    const foundList =
      await this.taskListsRepository.findTaskListById(taskListId)
    if (!foundList)
      throw new NotFoundError({
        origin: 'UnassignUserListUseCase',
        sub: taskListId.toString(),
      })

    const listUsers =
      await this.taskListsRepository.getTaskListUsers(taskListId)
    const userFound = listUsers.find((u) => u.id === userId)
    if (!userFound) throw new UserNotAssignedError()

    const result = await this.taskListsRepository.unassignUser(
      taskListId,
      userId,
    )
    if (!result) throw new AssignmentError()
  }
}
