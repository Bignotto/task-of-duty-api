import { NotFoundError } from '@/globals/errors/NotFoundError'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/inMemory/organizationRepository'
import { InMemoryTaskListsRepository } from '@/repositories/taskLists/inMemory/inMemoryTaskListsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeOrg } from '@/utils/tests/makeOrg'
import { makeTaskList } from '@/utils/tests/makeTaskList'
import { makeUser } from '@/utils/tests/makeUser'
import { Organization, TaskList, User, UserType } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { AssignListToUserUseCase } from './assignListToUser'
import { WrongOrganizationError } from './errors/WrongOrganizationError'

let taskListsRepository: InMemoryTaskListsRepository
let usersRepository: InMemoryUsersRepository
let organizationsRepository: InMemoryOrganizationsRepository

let taskList: TaskList
let user: User
let organization: Organization

let sut: AssignListToUserUseCase

describe('Assign TaskList to User', () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new AssignListToUserUseCase(taskListsRepository, usersRepository)

    user = await makeUser(
      {
        userType: UserType.ORGANIZATION,
      },
      usersRepository,
    )

    organizationsRepository = new InMemoryOrganizationsRepository()
    organization = await makeOrg(
      {
        ownerId: user.id,
      },
      organizationsRepository,
    )

    taskList = await makeTaskList(
      {
        creatorId: user.id,
        orgId: organization.id,
      },
      taskListsRepository,
    )
  })

  it('should be able to assign task list to user', async () => {
    const newUser = await makeUser(
      {
        orgId: organization.id,
      },
      usersRepository,
    )

    const result = await sut.execute({
      taskListId: taskList.id,
      assigneeId: newUser.id,
      userId: user.id,
    })
    expect(result).toBe(true)
  })

  it('should be able to assign more than one tasklist to same user', async () => {
    const newUser = await makeUser(
      {
        orgId: organization.id,
      },
      usersRepository,
    )

    const newTaskList = await makeTaskList(
      {
        creatorId: user.id,
        orgId: organization.id,
      },
      taskListsRepository,
    )

    await sut.execute({
      taskListId: taskList.id,
      assigneeId: newUser.id,
      userId: user.id,
    })

    const result = await sut.execute({
      taskListId: newTaskList.id,
      assigneeId: newUser.id,
      userId: user.id,
    })

    expect(result).toBe(true)
  })

  it('should not be able to assign task list to invalid user', async () => {
    await expect(
      sut.execute({
        taskListId: taskList.id,
        assigneeId: 'wrong user id',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to assign invalid task list to user', async () => {
    await expect(
      sut.execute({
        taskListId: BigInt(42),
        assigneeId: user.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to assign task list to user from other organization', async () => {
    const otherUser = await makeUser(
      {
        orgId: 'other organization',
      },
      usersRepository,
    )

    await expect(
      sut.execute({
        taskListId: taskList.id,
        assigneeId: otherUser.id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(WrongOrganizationError)
  })
})
