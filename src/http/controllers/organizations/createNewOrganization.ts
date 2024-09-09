import { NotFoundError } from '@/globals/errors/NotFoundError'
import { CnpjAlreadyInUseError } from '@/useCases/organizations/errors/CnpjAlreadyInUseError'
import { CnpjLengthError } from '@/useCases/organizations/errors/CnpjLengthError'
import { makeCreateNewOrganizationUseCase } from '@/useCases/organizations/factories/makeCreateNewOrganizationUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewOrganization(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newOrganizationBodySchema = z.object({
    name: z.string(),
    fantasyName: z.string(),
    cnpj: z.string(),
  })

  const { cnpj, fantasyName, name } = newOrganizationBodySchema.parse(
    request.body,
  )

  try {
    const createNewOrganization = makeCreateNewOrganizationUseCase()
    const { organization } = await createNewOrganization.execute({
      name,
      fantasyName,
      cnpj,
      ownerId: request.user.sub,
    })

    return reply.status(201).send(organization)
  } catch (error) {
    if (
      //TODO: better not found error status code for reply
      error instanceof NotFoundError ||
      error instanceof CnpjAlreadyInUseError ||
      error instanceof CnpjLengthError
    )
      return reply.status(404).send({ message: error.message })

    throw error
  }
}
