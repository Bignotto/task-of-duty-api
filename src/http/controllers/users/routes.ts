import { FastifyInstance } from "fastify";
import { createNewUser } from "./createNewUser";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", createNewUser);
}
