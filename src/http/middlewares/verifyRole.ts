import { UserType } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyRole(userTypeToVerify: UserType) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { userType } = request.user
    if (userType === userTypeToVerify)
      return reply.status(401).send({ message: 'Unauthorized' })
  }
}
