import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'


export const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.THE_APP_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log unknown error
  }

  return reply.status(500).send({ message: 'Unknown error...' })
})
