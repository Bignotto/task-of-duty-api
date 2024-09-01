import { InMemoryTasksRepository } from '@/repositories/tasks/inMemory/inMemoryTasksRepository'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { RecurrenceType, Task, TaskType } from '@prisma/client'

interface FakeTaskProps {
  title?: string
  creatorId?: string
  description?: string
  recurrenceType?: RecurrenceType
  taskType?: TaskType
  dueDate?: Date
  organizationId?: string
}

export async function makeTask(
  props: FakeTaskProps,
  tasksRepository: InMemoryTasksRepository,
): Promise<Task> {
  const task = await tasksRepository.create({
    title: props.title ?? faker.lorem.word(),
    description: props.description ?? faker.lorem.sentence(),
    recurrenceType: props.recurrenceType ?? RecurrenceType.EXACT,
    taskType: props.taskType ?? TaskType.TASK,
    dueDate:
      props.dueDate ??
      faker.date.future({
        years: 1,
      }),
    creator: {
      connect: {
        id: props.creatorId ?? 'USER ID',
      },
    },
    organization: {
      connect: {
        id: props.organizationId ?? 'ORG ID',
      },
    },
  })

  return task
}
