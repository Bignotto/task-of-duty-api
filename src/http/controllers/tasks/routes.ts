import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createTask } from './createTask'
import { getTask } from './getTask'

export async function tasksRoutes(app: FastifyInstance) {
  app.get(
    '/tasks/:taskId',
    {
      onRequest: [verifyJwt],
    },
    getTask,
  )
  app.post(
    '/tasks',
    {
      onRequest: [verifyJwt],
    },
    createTask,
  )
}
