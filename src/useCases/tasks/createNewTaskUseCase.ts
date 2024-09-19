import { InvalidDateError } from '@/globals/errors/InvalidDateError'
import { NotFoundError } from '@/globals/errors/NotFoundError'
import { IOrganizationsRepository } from '@/repositories/organizations/IOrganizationsRepository'
import { ITasksRepository } from '@/repositories/tasks/ITasksRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { RecurrenceType, Task, TaskType, UserType } from '@prisma/client'
import { isPast } from 'date-fns'
import { NotOrganizationOwnerError } from './errors/NotOrganizationOwnerError'

interface CreateNewTaskRequest {
  title: string
  description: string
  recurrenceType: RecurrenceType
  taskType: TaskType
  creatorId: string
  dueDate?: Date
}

interface CreateNewTaskResponse {
  task: Task
}

export class CreateNewTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private usersRepository: IUsersRepository,
    private organizationsRepository: IOrganizationsRepository,
  ) { }

  async execute({
    title,
    description,
    recurrenceType,
    taskType,
    creatorId,
    dueDate,
  }: CreateNewTaskRequest): Promise<CreateNewTaskResponse> {
    const pastDate = dueDate ? isPast(dueDate) : false;
    if (pastDate) throw new InvalidDateError()

    const creator = await this.usersRepository.findById(creatorId)
    if (!creator)
      throw new NotFoundError({
        origin: 'CreateNewTaskUseCase:creatorId',
        sub: creatorId,
      })

    if (creator.partOfOrganizationId) {
      // const org = await this.organizationsRepository.findById(organizationId)
      // if (!org) throw new NotFoundError({
      //   origin: 'CreateNewTaskUseCase:organizationId',
      //   sub: creator.partOfOrganizationId,
      // })


      if (creator.userType !== UserType.ORGANIZATION)
        throw new NotOrganizationOwnerError({
          origin: 'CreateNewTaskUseCase',
        })
    }


    const task = await this.tasksRepository.create({
      title,
      description,
      dueDate,
      creator: { connect: { id: creatorId } },
      recurrenceType,
      taskType,
      organization: creator.partOfOrganizationId ? { connect: { id: creator.partOfOrganizationId } } : undefined,
    })

    return { task }
  }
}
