import { app } from '@/app'
import { createAndAssignOrganization } from '@/utils/tests/createAndAssignOrganization'
import { createAuthenticatedUser } from '@/utils/tests/createAuthenticatedUser'
import { createUserInvite } from '@/utils/tests/createUserInvite'
import { fakerPT_BR as faker } from '@faker-js/faker'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('E2E Create User Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to create new user with an invite', async () => {
    const { token } = await createAuthenticatedUser(app)
    await createAndAssignOrganization(app, token)
    const { invite } = await createUserInvite(app, token)

    const response = await request(app.server)
      .post('/users')
      .send({
        name: faker.person.fullName(),
        email: '99-99999-9999',
        password: '123456',
        invite: invite.id ?? undefined,
      })

    expect(response.statusCode).toEqual(201)
  })
})
