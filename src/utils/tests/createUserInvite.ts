import { fakerPT_BR as faker } from '@faker-js/faker'
import { addDays } from 'date-fns'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface FakeInviteProps {
  invitedPhone?: string,
  invitedEmail?: string,
  dueDate?: string
}

export async function createUserInvite(
  app: FastifyInstance,
  token: string,
  props: FakeInviteProps = {},
) {
  const response = await request(app.server)
    .post('/invites')
    .set('Authorization', `Bearer ${token}`)
    .send({
      invitedPhone: props.invitedPhone ?? faker.phone.number(),
      invitedEmail: props.invitedEmail ?? faker.internet.email(),
      dueDate: props.dueDate ?? addDays(new Date(), 2)
    })

  const invite = response.body;
  return {
    invite
  }
}