import { InvalidDateError } from '@/globals/errors/InvalidDateError'
import { NotFoundError } from '@/globals/errors/NotFoundError'
import { NotOrganizationOwnerError } from '@/useCases/tasks/errors/NotOrganizationOwnerError'
import { WrongOrganizationError } from '@/useCases/tasks/errors/WrongOrganizationError'
import { makeCreateNewTaskUseCase } from '@/useCases/tasks/factories/makeCreateTaskUseCase'
import { safeJson } from '@/utils/converters/safeJSON'
import { RecurrenceType, TaskType } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const newTaskBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    recurrenceType: z.nativeEnum(RecurrenceType),
    taskType: z.nativeEnum(TaskType),
    dueDate: z.coerce.date().optional(),
  })

  const { title, description, recurrenceType, taskType, dueDate } =
    newTaskBodySchema.parse(request.body)

  try {
    const createNewTaskUseCase = makeCreateNewTaskUseCase()
    const { task } = await createNewTaskUseCase.execute({
      title,
      description,
      recurrenceType,
      creatorId: request.user.sub,
      taskType,
      dueDate,
    })

    return reply.status(201).send(safeJson(task))
  } catch (error) {
    if (error instanceof InvalidDateError)
      reply.status(400).send({ error: error.message })

    if (error instanceof NotFoundError) return reply.status(404).send(error)

    if (
      error instanceof NotOrganizationOwnerError ||
      error instanceof WrongOrganizationError
    )
      return reply.status(400).send(error)

    throw error
  }
}
