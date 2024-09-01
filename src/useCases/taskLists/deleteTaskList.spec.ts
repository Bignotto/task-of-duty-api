import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { InMemoryTaskListsRepository } from '@/repositories/taskLists/inMemory/inMemoryTaskListsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeTaskList } from '@/utils/tests/makeTaskList'
import { makeUser } from '@/utils/tests/makeUser'
import { Task, User, UserType } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTaskListUseCase } from './deleteTaskList'

let user: User
let task: Task

let usersRepository: InMemoryUsersRepository
let taskListsRepository: InMemoryTaskListsRepository

let sut: DeleteTaskListUseCase

describe('Delete Task List Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    taskListsRepository = new InMemoryTaskListsRepository()

    sut = new DeleteTaskListUseCase(taskListsRepository, usersRepository)

    user = await makeUser(
      {
        userType: UserType.ORGANIZATION,
      },
      usersRepository,
    )
  })

  it('should be able to delete a task list', async () => {
    const task = await makeTaskList(
      {
        creatorId: user.id,
        orgId: user.partOfOrganizationId ?? '',
      },
      taskListsRepository,
    )

    await sut.execute({
      taskListId: task.id,
      userId: user.id,
    })

    expect(taskListsRepository.lists.length).toBe(0)
  })

  it('should not be able to delete an invalid task list', async () => {
    await expect(
      sut.execute({
        taskListId: BigInt(42),
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a task with invalid user', async () => {
    const task = await makeTaskList(
      {
        creatorId: user.id,
        orgId: user.partOfOrganizationId ?? '',
      },
      taskListsRepository,
    )

    await expect(
      sut.execute({
        taskListId: task.id,
        userId: 'wrong user id',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a task from different organization', async () => {
    const task = await makeTaskList(
      {
        creatorId: user.id,
        orgId: 'other organization',
      },
      taskListsRepository,
    )

    await expect(
      sut.execute({
        taskListId: task.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotSameOrganizationError)
  })
})
