import { makeGetTaskUseCase } from '@/useCases/tasks/factories/makeGetTaskUseCase'
import { safeJson } from '@/utils/converters/safeJSON'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getTask(request: FastifyRequest, reply: FastifyReply) {
  const getTaskParamsSchema = z.object({
    taskId: z.coerce.bigint(),
  })

  const { taskId } = getTaskParamsSchema.parse(request.params)

  const getTaskUseCase = makeGetTaskUseCase()
  const { task } = await getTaskUseCase.execute({ taskId })

  if (task) return reply.status(200).send(safeJson(task))

  return reply.status(404).send({})
}
