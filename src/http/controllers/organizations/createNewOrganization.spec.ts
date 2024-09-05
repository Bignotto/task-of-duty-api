import { app } from '@/app'
import { createAuthenticatedUser } from '@/utils/tests/createAuthenticatedUser'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('E2E Create Organization Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create new organization', async () => {
    const { token } = await createAuthenticatedUser(app)

    const response = await request(app.server)
      .post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Fake Organization',
        fantasyName: 'Fake Org',
        cnpj: '12345678901234',
      })

    expect(response.status).toEqual(201)
    expect(response.body.fantasyName).toEqual('Fake Org')
  })

  it('should not be able to create new organization with invalid cnpj', async () => {
    // TODO: finish controller validation tests
  })
})
