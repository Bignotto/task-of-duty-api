import { ITaskListsRepository } from '@/repositories/taskLists/ITaskListsRepository'
import { AssignmentError } from './errors/AssignmentError'

interface RemoveTaskFromListRequest {
  taskListId: bigint
  taskId: bigint
}

export class RemoveTaskFromLisUseCase {
  constructor(private taskListsRepository: ITaskListsRepository) {}

  async execute({ taskListId, taskId }: RemoveTaskFromListRequest) {
    const result = await this.taskListsRepository.removeTaskFromList(
      taskListId,
      taskId,
    )

    if (!result) throw new AssignmentError()
  }
}
