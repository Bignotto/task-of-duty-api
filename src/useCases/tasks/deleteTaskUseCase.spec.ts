import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { InMemoryTasksRepository } from '@/repositories/tasks/inMemory/inMemoryTasksRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeTask } from '@/utils/tests/makeTask'
import { makeUser } from '@/utils/tests/makeUser'
import { Task, User, UserType } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTaskUseCase } from './deleteTaskUseCase'

let user: User
let task: Task

let usersRepository: InMemoryUsersRepository
let tasksRepository: InMemoryTasksRepository

let sut: DeleteTaskUseCase

describe('Delete Task Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    tasksRepository = new InMemoryTasksRepository()

    sut = new DeleteTaskUseCase(tasksRepository, usersRepository)

    user = await makeUser(
      {
        userType: UserType.ORGANIZATION,
        orgId: 'Fake Org',
      },
      usersRepository,
    )
  })

  it('should be able to delete a task', async () => {
    const task = await makeTask(
      {
        creatorId: user.id,
        organizationId: user.partOfOrganizationId ?? '',
      },
      tasksRepository,
    )

    await sut.execute({
      taskId: task.id,
      userId: user.id,
    })

    expect(tasksRepository.items.length).toBe(0)
  })

  it('should not be able to delete an invalid task', async () => {
    await expect(
      sut.execute({
        taskId: BigInt(42),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a task with invalid user', async () => {
    const task = await makeTask(
      {
        creatorId: user.id,
        organizationId: user.partOfOrganizationId ?? '',
      },
      tasksRepository,
    )

    await expect(
      sut.execute({
        taskId: task.id,
        userId: 'wrong user id',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a task from different organization', async () => {
    const task = await makeTask(
      {
        creatorId: user.id,
        organizationId: 'other organization',
      },
      tasksRepository,
    )

    await expect(
      sut.execute({
        taskId: task.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotSameOrganizationError)
  })
})
