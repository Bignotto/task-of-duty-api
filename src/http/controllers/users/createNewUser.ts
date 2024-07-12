import { EmailAlreadyInUse } from "@/useCases/users/errors/EmailAlreadyInUseError";
import { makeCreateNewUserUseCase } from "@/useCases/users/factories/makeCreateNewUserUseCase";
import { UserType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
    phone: z.string().optional(),
    userType: z.nativeEnum(UserType).optional(),
  });

  const { name, email, password, phone, userType } = newUserBodySchema.parse(
    request.body,
  );

  try {
    const createNewUserUseCase = makeCreateNewUserUseCase();
    await createNewUserUseCase.execute({
      name,
      email,
      password,
      phone,
      userType,
    });
  } catch (error) {
    if (error instanceof EmailAlreadyInUse) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
