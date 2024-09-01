import { InMemoryInvitesRepository } from '@/repositories/invites/inMemory/inMemoryInvitesRepository'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/inMemory/organizationRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { Organization, UserType } from '@prisma/client'
import { subDays } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateNewUserUseCase } from './createNewUser'
import { EmailAlreadyInUseError } from './errors/EmailAlreadyInUseError'
import { ExpiredInviteError } from './errors/ExpiredInviteError'
import { InvalidInviteError } from './errors/InvalidInviteError'
import { InvalidPhoneNumberError } from './errors/InvalidPhoneNumberError'
import { PasswordLengthError } from './errors/PasswordLengthError'

let usersRepository: InMemoryUsersRepository
let invitesRepository: InMemoryInvitesRepository
let sut: CreateNewUserUseCase

let organizationsRepository: InMemoryOrganizationsRepository
let organization: Organization

describe('Create New User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    invitesRepository = new InMemoryInvitesRepository()
    sut = new CreateNewUserUseCase(usersRepository, invitesRepository)
  })

  it('should be able to create a new user', async () => {
    const { user } = await sut.execute({
      name: 'Mary Jane',
      email: 'mj@dailyplanet.com',
      password: '123456',
      phone: '(19)93646-4678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('userType should be ORGANIZATION if no invite is provided', async () => {
    const { user } = await sut.execute({
      name: 'Mary Jane',
      email: 'mj@dailyplanet.com',
      password: '123456',
    })

    expect(user.userType).toEqual(UserType.ORGANIZATION)
  })

  it('userType should be USER if an invite is provided', async () => {
    const { user } = await sut.execute({
      name: 'Mary Jane',
      email: 'mj@dailyplanet.com',
      password: '123456',
    })

    organizationsRepository = new InMemoryOrganizationsRepository()
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

    const invite = await invitesRepository.create({
      creator: {
        connect: {
          id: user.id,
        },
      },
      invitedPhone: '99999999999',
      organization: {
        connect: {
          id: organization.id,
        },
      },
    })

    const { user: newUser } = await sut.execute({
      name: 'JJ Jameson',
      email: 'jjjameson@dailyplanet.com',
      password: '123456',
      inviteId: invite.id,
    })

    expect(newUser.userType).toEqual(UserType.USER)
    expect(newUser.partOfOrganizationId).toEqual(organization.id)
  })

  it('should not be able to register using an invalid invite', async () => {
    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        password: '123456',
        inviteId: 'some invalid invite id',
      }),
    ).rejects.toBeInstanceOf(InvalidInviteError)
  })

  it('should not be able to register using an expired invite', async () => {
    const invite = await invitesRepository.create({
      creator: {
        connect: {
          id: 'user.id',
        },
      },
      invitedPhone: '99999999999',
      dueDate: subDays(new Date(), 1),
      organization: {
        connect: {
          id: organization.id,
        },
      },
    })
    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        password: '123456',
        inviteId: invite.id,
      }),
    ).rejects.toBeInstanceOf(ExpiredInviteError)
  })

  it('should not be able to register using same email twice', async () => {
    await sut.execute({
      name: 'Mary Jane',
      email: 'mj@dailyplanet.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('should not be able to register with a less than 6 characters password', async () => {
    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(PasswordLengthError)
  })

  it('should not be able to register with invalid phone number', async () => {
    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        password: '123456',
        phone: 'invalid phone number',
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneNumberError)
  })
})
