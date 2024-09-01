import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotSameOrganizationError } from '@/globals/errors/NotSameOrganizationError'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/inMemory/organizationRepository'
import { InMemoryTaskListsRepository } from '@/repositories/taskLists/inMemory/inMemoryTaskListsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeOrg } from '@/utils/tests/makeOrg'
import { makeUser } from '@/utils/tests/makeUser'
import { Organization, User, UserType } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotOrganizationAdminError } from '../../globals/errors/NotOrganizationAdminError'
import { CreateTaskListUseCase } from './createTaskList'

let user: User
let organization: Organization

let taskListsRepository: InMemoryTaskListsRepository
let usersRepository: InMemoryUsersRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: CreateTaskListUseCase

describe('Create Task List Use Case', () => {
  beforeEach(async () => {
    taskListsRepository = new InMemoryTaskListsRepository()
    usersRepository = new InMemoryUsersRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateTaskListUseCase(
      taskListsRepository,
      usersRepository,
      organizationsRepository,
    )

    organization = await makeOrg({}, organizationsRepository)

    user = await makeUser(
      {
        orgId: organization.id,
        userType: UserType.ORGANIZATION,
      },
      usersRepository,
    )
  })

  it('should be able to create a new task list', async () => {
    const { list } = await sut.execute({
      creatorId: user.id,
      description: 'Get a first page history step by step.',
      title: 'First Page',
      organizationId: organization.id,
    })

    expect(list.id).toEqual(expect.any(BigInt))
  })

  it('should be able to create a new task list linked with an organization', async () => {
    const { list } = await sut.execute({
      creatorId: user.id,
      description: 'Get a first page history step by step.',
      title: 'First Page',
      organizationId: organization.id,
    })

    expect(list.id).toEqual(expect.any(BigInt))
    expect(list.organizationId).toEqual(expect.any(String))
    expect(list.organizationId?.length).toBeGreaterThan(0)
  })

  it('should not be able to create new task list with invalid creator id', async () => {
    await expect(
      sut.execute({
        creatorId: 'invalid id',
        description: 'Get a first page history step by step.',
        title: 'First Page',
        organizationId: organization.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create new task list with invalid organization id', async () => {
    await expect(
      sut.execute({
        creatorId: user.id,
        description: 'Get a first page history step by step.',
        title: 'First Page',
        organizationId: 'invalid organization',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create new task list with another organization', async () => {
    const otherOrganization = await makeOrg({}, organizationsRepository)

    await expect(
      sut.execute({
        creatorId: user.id,
        description: 'Get a first page history step by step.',
        title: 'First Page',
        organizationId: otherOrganization.id,
      }),
    ).rejects.toBeInstanceOf(NotSameOrganizationError)
  })

  it('should not be able to create new task list with creator not being organization admin', async () => {
    const newUser = await makeUser(
      {
        orgId: organization.id,
        userType: UserType.USER,
      },
      usersRepository,
    )

    await expect(
      sut.execute({
        creatorId: newUser.id,
        description: 'Get a first page history step by step.',
        title: 'First Page',
        organizationId: organization.id,
      }),
    ).rejects.toBeInstanceOf(NotOrganizationAdminError)
  })
})
