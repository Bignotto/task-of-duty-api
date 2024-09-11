import { FastifyInstance } from "fastify";
import { usersRoutes } from "../controllers/users/routes";
import { sessionRoutes } from "../controllers/sessions/routes";
import { organizationRoutes } from "../controllers/organizations/routes";
import { invitesRoutes } from "../controllers/invites/routes";


export async function appRoutes(app: FastifyInstance) {
  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(organizationRoutes)
  app.register(invitesRoutes)
}