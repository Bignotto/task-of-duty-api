import { app } from '@/app'
import { createAndAssignOrganization } from '@/utils/tests/createAndAssignOrganization'
import { createAuthenticatedUser } from '@/utils/tests/createAuthenticatedUser'
import { addDays } from 'date-fns'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('E2E Create Invites Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create new invite', async () => {
    const { token } = await createAuthenticatedUser(app)
    await createAndAssignOrganization(app, token, {})

    const response = await request(app.server)
      .post('/invites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        invitedPhone: "(12)34567-8901",
        invitedEmail: "a@b.c",
        dueDate: addDays(new Date(), 2)
      })

    expect(response.status).toEqual(201)
    expect(response.body.invite.status).toEqual('OPEN')
  })

  // it('should not be able to create new organization with invalid cnpj', async () => {
  //   // TODO: finish controller validation tests
  // })
})
