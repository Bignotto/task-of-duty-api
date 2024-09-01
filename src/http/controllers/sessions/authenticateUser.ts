import { InvalidCredentialsError } from '@/useCases/sessions/errors/InvalidCredentialsError'
import { makeAuthenticateUserUseCase } from '@/useCases/sessions/factories/makeAuthenticateUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newUserBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  })

  const { email, password } = newUserBodySchema.parse(request.body)

  try {
    const authenticateUserUseCase = makeAuthenticateUserUseCase()
    const { user } = await authenticateUserUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        userType: user.userType,
        org: user.partOfOrganizationId,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        userType: user.userType,
        org: user.partOfOrganizationId,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
