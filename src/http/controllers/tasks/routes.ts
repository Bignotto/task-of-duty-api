import { FastifyInstance } from 'fastify'
import { createTask } from './createTask'

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', createTask)
}
