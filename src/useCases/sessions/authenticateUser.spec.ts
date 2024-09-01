import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUserUseCase } from './authenticateUser'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Mary Jane',
      email: 'mj@dailybugle.com',
      passwordHash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'mj@dailybugle.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Mary Jane',
      email: 'mj@dailybugle.com',
      passwordHash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'mj@dailybugle.com',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong email address', async () => {
    await usersRepository.create({
      name: 'Mary Jane',
      email: 'mj@dailybugle.com',
      passwordHash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'mg@dailybugle.com',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
