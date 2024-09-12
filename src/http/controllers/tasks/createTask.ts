import { makeCreateNewTaskUseCase } from "@/useCases/tasks/factories/makeCreateTaskUseCase";
import { RecurrenceType, TaskType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createTask(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const newTaskBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    recurrenceType: z.nativeEnum(RecurrenceType),
    taskType: z.nativeEnum(TaskType),
    creatorId: z.string(),
    dueDate: z.date().optional(),
    organizationId: z.string(),
  });

  const { title, description,
    recurrenceType,
    taskType,
    creatorId,
    dueDate,
    organizationId
  } = newTaskBodySchema.parse(request.body);

  try {
    const createNewTaskUseCase = makeCreateNewTaskUseCase()
    const response = await createNewTaskUseCase.execute({
      title, description, recurrenceType, creatorId, organizationId, taskType, dueDate
    });
  } catch (error) {

  }

}