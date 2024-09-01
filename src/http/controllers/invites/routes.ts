import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createNewInvite } from './createNewInvite'

export default async function invitesRoutes(app: FastifyInstance) {
  app.post(
    '/invites',
    {
      onRequest: [verifyJwt],
    },
    createNewInvite,
  )
}
