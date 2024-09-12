import { EmailAlreadyInUseError } from '@/useCases/users/errors/EmailAlreadyInUseError'
import { makeCreateNewUserUseCase } from '@/useCases/users/factories/makeCreateNewUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
    phone: z.string().optional(),
    inviteId: z.string().optional(),
  })

  const { name, email, password, phone, inviteId } = newUserBodySchema.parse(
    request.body,
  )

  try {
    const createNewUserUseCase = makeCreateNewUserUseCase()
    await createNewUserUseCase.execute({
      name,
      email,
      password,
      phone,
      inviteId
    })
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}

// TODO: fix errors in this file
