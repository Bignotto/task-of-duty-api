import { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.status(200).send({ message: 'yes', user: request.user.sub })
}
