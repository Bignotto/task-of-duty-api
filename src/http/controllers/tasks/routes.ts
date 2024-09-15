import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createTask } from './createTask'

export async function tasksRoutes(app: FastifyInstance) {
  app.post(
    '/tasks',
    {
      onRequest: [verifyJwt],
    },
    createTask,
  )
}
