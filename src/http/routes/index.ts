import { FastifyInstance } from 'fastify'
import { invitesRoutes } from '../controllers/invites/routes'
import { organizationRoutes } from '../controllers/organizations/routes'
import { sessionRoutes } from '../controllers/sessions/routes'
import { tasksRoutes } from '../controllers/tasks/routes'
import { usersRoutes } from '../controllers/users/routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(organizationRoutes)
  app.register(invitesRoutes)
  app.register(tasksRoutes)
}
