import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { sessionRoutes } from "./http/controllers/sessions/routes";
import { usersRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.THE_APP_SECRET,
});

app.register(usersRoutes);
app.register(sessionRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    //TODO: log unknown error
  }
  console.log({ error });

  return reply.status(500).send({ message: "Fodeu..." });
});
