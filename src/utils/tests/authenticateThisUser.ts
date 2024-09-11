import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface AuthenticateThisUserPros {
  email: string;
  password: string;
}

export async function authenticateThisUser(
  app: FastifyInstance,
  props: AuthenticateThisUserPros
) {
  const authResponse = await request(app.server).post('/sessions').send({
    email: props.email,
    password: props.password,
  })

  const { token } = authResponse.body

  return { token }
}