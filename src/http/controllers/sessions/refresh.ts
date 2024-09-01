import { FastifyReply, FastifyRequest } from 'fastify'

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const { userType, sub } = request.user
  const token = await reply.jwtSign(
    {
      userType,
    },
    {
      sign: {
        sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      userType,
    },
    {
      sign: {
        sub,
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
}
