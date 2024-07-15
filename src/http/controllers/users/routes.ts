import { verifyJwt } from "@/http/middlewares/verifyJwt";
import { FastifyInstance } from "fastify";
import { createNewUser } from "./createNewUser";
import { getUserProfile } from "./getUserProfile";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", createNewUser);

  app.get(
    "/me",
    {
      onRequest: [verifyJwt],
    },
    getUserProfile,
  );
}
