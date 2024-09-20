import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getTask(request: FastifyRequest, reply: FastifyReply) {
  const getTaskParamsSchema = z.object({
    taskId: z.coerce.bigint(),
  })

  const { taskId } = getTaskParamsSchema.parse(request.params)

  try {
  } catch (error) { }
}
