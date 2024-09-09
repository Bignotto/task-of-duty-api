import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      org: string
      userType: 'ADMIN' | 'ORGANIZATION' | 'USER'
    }
  }
}
