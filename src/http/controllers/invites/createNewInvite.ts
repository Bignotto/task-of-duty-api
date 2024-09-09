import { makeCreateNewInviteUseCase } from '@/useCases/invites/factories/makeCreateNewInviteUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewInvite(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newInviteBodySchema = z.object({
    invitedPhone: z.string(),
    invitedEmail: z.string().optional(),
    dueDate: z.coerce.date().optional(),
  })

  const { invitedPhone, invitedEmail, dueDate } = newInviteBodySchema.parse(
    request.body,
  )

  try {
    const createNewInviteUseCase = makeCreateNewInviteUseCase();
    const invite = await createNewInviteUseCase.execute({
      creatorId: request.user.sub,
      invitedPhone,
      dueDate,
      invitedEmail
    })

    return reply.status(201).send({ invite })
  } catch (error) {
    return reply.status(500).send(error)
  }

}
