import { FastifyInstance } from "fastify";
import { authenticateUser } from "./authenticateUser";

export async function sessionRoutes(app: FastifyInstance) {
  app.post("/sessions", authenticateUser);
}
