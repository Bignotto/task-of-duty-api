import { InMemoryTasksRepository } from '@/repositories/tasks/inMemory/inMemoryTasksRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeTask } from '@/utils/tests/makeTask'
import { makeUser } from '@/utils/tests/makeUser'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetTaskUseCase } from './getTaskUseCase'

let tasksRepository: InMemoryTasksRepository
let sut: GetTaskUseCase

let usersRepository: InMemoryUsersRepository

describe('Get Task Use Case', () => {
  beforeEach(async () => {
    tasksRepository = new InMemoryTasksRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new GetTaskUseCase(tasksRepository)
  })

  it('should be able to retrieve a task with an id', async () => {
    const user = await makeUser({}, usersRepository)
    const task = await makeTask(
      {
        creatorId: user.id,
      },
      tasksRepository,
    )

    const response = await sut.execute({ taskId: task.id })

    expect(response.task).not.toBeNull()
    expect(response.task!.id).toEqual(expect.any(BigInt))
    expect(response.task!.title).toEqual(task.title)
  })

  it('should not be able to retrieve a task with an invalid id', async () => {
    const response = await sut.execute({ taskId: BigInt(42) })

    expect(response.task).toBeNull()
  })
})
