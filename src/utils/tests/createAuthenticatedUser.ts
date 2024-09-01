import { fakerPT_BR as faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface FakeAuthenticatedUserProps {
  id?: string
  name?: string
  phone?: string
  email?: string
}

export async function createAuthenticatedUser(
  app: FastifyInstance,
  props: FakeAuthenticatedUserProps = {},
) {
  await request(app.server)
    .post('/users')
    .send({
      email: 'dunha@gmail.com',
      name: props.name ?? faker.person.fullName(),
      phone: props.phone ?? faker.phone.number(),
      password: '123456',
    })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'dunha@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
