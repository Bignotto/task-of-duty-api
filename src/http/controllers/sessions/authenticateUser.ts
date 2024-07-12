import { InvalidCredentialsError } from "@/useCases/sessions/errors/InvalidCredentialsError";
import { makeAuthenticateUserUseCase } from "@/useCases/sessions/factories/makeAuthenticateUserUseCase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newUserBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = newUserBodySchema.parse(request.body);

  try {
    const createNewUserUseCase = makeAuthenticateUserUseCase();
    await createNewUserUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
