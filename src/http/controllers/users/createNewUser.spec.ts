import { app } from '@/app'
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
      name: 'Mary Jane Watson',
      email: 'mj@dailybuggle.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
