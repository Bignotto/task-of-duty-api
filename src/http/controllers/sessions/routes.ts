import { FastifyInstance } from "fastify";
import { authenticateUser } from "./authenticateUser";
import { refreshToken } from "./refresh";

export async function sessionRoutes(app: FastifyInstance) {
  app.post("/sessions", authenticateUser);
  app.patch("/sessions/refresh", refreshToken);
}
