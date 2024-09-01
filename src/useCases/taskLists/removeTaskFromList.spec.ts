import { InMemoryTaskListsRepository } from '@/repositories/taskLists/inMemory/inMemoryTaskListsRepository'
import { InMemoryTasksRepository } from '@/repositories/tasks/inMemory/inMemoryTasksRepository'
import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { makeTask } from '@/utils/tests/makeTask'
import { makeTaskList } from '@/utils/tests/makeTaskList'
import { makeUser } from '@/utils/tests/makeUser'
import { Task, TaskList, User } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { AssignmentError } from './errors/AssignmentError'
import { RemoveTaskFromLisUseCase } from './removeTaskFromList'

let usersRepository: InMemoryUsersRepository
let tasksRepository: InMemoryTasksRepository
// let organizationsRepository: InMemoryOrganizationsRepository;

let user: User
let task1: Task
let task2: Task
let taskList: TaskList
// let organization: Organization;

let taskListsRepository: InMemoryTaskListsRepository

let sut: RemoveTaskFromLisUseCase

describe('Remove Task from List Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    tasksRepository = new InMemoryTasksRepository()

    taskListsRepository = new InMemoryTaskListsRepository()

    sut = new RemoveTaskFromLisUseCase(taskListsRepository)

    user = await makeUser({}, usersRepository)

    task1 = await makeTask(
      {
        creatorId: user.id,
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
    )

    task2 = await makeTask(
      {
        creatorId: user.id,
        organizationId: `${user.partOfOrganizationId}`,
      },
      tasksRepository,
    )

    taskList = await makeTaskList(
      {
        orgId: `${user.partOfOrganizationId}`,
      },
      taskListsRepository,
    )
  })

  it('should be able to remove a task from a task list', async () => {
    await taskListsRepository.addTaskToList(task1.id, taskList.id)
    await taskListsRepository.addTaskToList(task2.id, taskList.id)

    await sut.execute({
      taskListId: taskList.id,
      taskId: task1.id,
    })

    const remaining = await taskListsRepository.getTaskListTasksById(
      taskList.id,
    )

    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toEqual(task2.id)
  })

  it('should not be able to remove a task from an invalid task list', async () => {
    await taskListsRepository.addTaskToList(task1.id, taskList.id)
    await taskListsRepository.addTaskToList(task2.id, taskList.id)

    await expect(
      sut.execute({
        taskListId: BigInt(42),
        taskId: task1.id,
      }),
    ).rejects.toBeInstanceOf(AssignmentError)
  })

  it('should not be able to remove an invalid task from a task list', async () => {
    await taskListsRepository.addTaskToList(task1.id, taskList.id)
    await taskListsRepository.addTaskToList(task2.id, taskList.id)

    await expect(
      sut.execute({
        taskListId: taskList.id,
        taskId: BigInt(42),
      }),
    ).rejects.toBeInstanceOf(AssignmentError)
  })
})

/**
https://www.erome.com/a/ltMZaN9w
https://www.erome.com/a/HRMVb77a

https://www.erome.com/M%C3%ADdia_RN
https://www.erome.com/a/rsDiZsfH
https://www.erome.com/a/7Y6wSfpM
https://www.erome.com/a/C1nmMk4w
https://www.erome.com/a/pQZlUNFV

https://www.erome.com/a/ZLMHbVgs

https://www.erome.com/a/FQKmgJBp
**/
