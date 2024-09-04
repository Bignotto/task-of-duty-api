import { InMemoryInvitesRepository } from '@/repositories/invites/inMemory/inMemoryInvitesRepository'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/inMemory/organizationRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { Organization, User, UserType } from '@prisma/client'
import { addDays, subDays } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateNewInviteUseCase } from './createNewInvite'
import { InvalidDateError } from './errors/InvalidDateError'
import { InvalidPhoneNumberError } from './errors/InvalidPhoneError'
import { NotFoundError } from './errors/NotFoundError'
import { NotOrganizationAdminError } from './errors/NotOrganizationAdmin'
import { makeUser } from '@/utils/tests/makeUser'

let invitesRepository: InMemoryInvitesRepository
let usersRepository: InMemoryUsersRepository
let organizationsRepository: InMemoryOrganizationsRepository
let user: User
let organization: Organization

let sut: CreateNewInviteUseCase

describe('Invite User Use Case', () => {
  beforeEach(async () => {
    invitesRepository = new InMemoryInvitesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateNewInviteUseCase(invitesRepository, usersRepository)

    organizationsRepository = new InMemoryOrganizationsRepository()

    user = await usersRepository.create({
      email: 'mj@dailybuggle.com',
      name: 'Mary Jane',
      passwordHash: 'hashed_password',
      userType: UserType.ORGANIZATION,
    })

    organization = await organizationsRepository.create({
      cnpj: '12345678901234',
      fantasyName: 'The Buggle',
      name: 'The Daily Buggle',
      owner: {
        connect: {
          id: user.id,
        },
      },
    })
  })

  it('organizations owner should be able to invite users', async () => {
    const { userInvite } = await sut.execute({
      invitedPhone: '(12)34567-8901',
      creatorId: user.id,
    })

    expect(userInvite.id).toEqual(expect.any(String))
  })

  it('should not be able to create an invite without a valid phone number', async () => {
    await expect(() =>
      sut.execute({
        invitedPhone: 'invalid phone number',
        creatorId: user.id,
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneNumberError)
  })

  it('should not be able to create an invite with invalid date', async () => {
    await expect(() =>
      sut.execute({
        invitedPhone: '(12)34567-8901',
        dueDate: subDays(new Date(), 1), // yesterday
        creatorId: user.id,
      }),
    ).rejects.toBeInstanceOf(InvalidDateError)
  })

  it('should not be able to create an invite with USER type users', async () => {
    const userTypeUser = await usersRepository.create({
      email: 'jjj@dailybuggle.com',
      name: 'J Jonah Jameson',
      passwordHash: 'hashed_password',
      userType: UserType.USER,
    })

    await expect(() =>
      sut.execute({
        invitedPhone: '(12)34567-8901',
        creatorId: userTypeUser.id,
      }),
    ).rejects.toBeInstanceOf(NotOrganizationAdminError)
  })

  it('should not be able to create an invite with invalid creator id', async () => {
    await expect(() =>
      sut.execute({
        invitedPhone: '(12)34567-8901',
        dueDate: addDays(new Date(), 1),
        creatorId: 'some invalid id',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create an invite without linked organization', async () => {
    const someUser = await makeUser({
      userType: 'USER'
    }, usersRepository)

    await expect(() =>
      sut.execute({
        invitedPhone: '(12)34567-8901',
        dueDate: addDays(new Date(), 1),
        creatorId: someUser.id,
      }),
    ).rejects.toBeInstanceOf(NotOrganizationAdminError)
  });
})
