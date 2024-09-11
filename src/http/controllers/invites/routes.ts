import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createNewInvite } from './createNewInvite'

export async function invitesRoutes(app: FastifyInstance) {
  app.post(
    '/invites',
    {
      onRequest: [verifyJwt],
    },
    createNewInvite,
  )
}
