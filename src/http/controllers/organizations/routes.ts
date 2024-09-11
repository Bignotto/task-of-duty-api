import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createNewOrganization } from './createNewOrganization'

export async function organizationRoutes(app: FastifyInstance) {
  app.post(
    '/organizations',
    {
      onRequest: [verifyJwt],
    },
    createNewOrganization,
  )
}
