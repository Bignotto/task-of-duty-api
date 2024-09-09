import { NotFoundError } from '@/globals/errors/NotFoundError'
import { InMemoryTasksRepository } from '@/repositories/tasks/inMemory/inMemoryTasksRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeTask } from '@/utils/tests/makeTask'
import { makeUser } from '@/utils/tests/makeUser'
import { User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { WrongOrganizationError } from './errors/WrongOrganizationError'
import { MarkTaskDoneUseCase } from './markTaskDoneUseCase'

let user: User

let usersRepository: InMemoryUsersRepository
let tasksRepository: InMemoryTasksRepository

let sut: MarkTaskDoneUseCase

describe('Mark Task Done Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    tasksRepository = new InMemoryTasksRepository()
    sut = new MarkTaskDoneUseCase(tasksRepository, usersRepository)

    user = await makeUser(
      {
        orgId: 'ORG ID',
      },
      usersRepository,
    )
  })

  it('should be able to mark a task done', async () => {
    const task = await makeTask(
      {
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
    )

    const { taskDone } = await sut.execute({
      taskId: task.id,
      userId: user.id,
      comments: 'Some random comments about task done.',
    })

    expect(taskDone.id).toEqual(expect.any(BigInt))
  })

  it('should not be able to mark an invalid task done', async () => {
    await expect(
      sut.execute({
        taskId: BigInt(42),
        userId: user.id,
        comments: 'Some random comments about task done',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to mark a task done with invalid user', async () => {
    const task = await makeTask(
      {
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
    )
    await expect(
      sut.execute({
        taskId: task.id,
        userId: 'WRONG USER',
        comments: 'Some random comments about task done',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to mark a task from different organization done', async () => {
    const task = await makeTask(
      {
        organizationId: 'WRONG ORG ID',
      },
      tasksRepository,
    )

    await expect(
      sut.execute({
        taskId: task.id,
        userId: user.id,
        comments: 'Some random comments about task done',
      }),
    ).rejects.toBeInstanceOf(WrongOrganizationError)
  })
})
