import { app } from '@/app'
import { createAndAssignOrganization } from '@/utils/tests/createAndAssignOrganization'
import { createAuthenticatedUser } from '@/utils/tests/createAuthenticatedUser'
import { addDays } from 'date-fns'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('E2E Create task Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create new task', async () => {
    const { token } = await createAuthenticatedUser(app)
    // await createAndAssignOrganization(app, token, {})

    const response = await request(app.server)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task 1',
        description: 'first ever task',
        recurrenceType: 'MONTHLY',
        taskType: 'TASK',
        dueDate: addDays(new Date(), 2),
      })

    const task = JSON.parse(response.text)

    expect(response.status).toEqual(201)
    expect(task.id).toEqual(expect.any(String))
  })

  it('should be able to create a task with linked organization', async () => {
    const { token } = await createAuthenticatedUser(app)
    await createAndAssignOrganization(app, token, {})

    const response = await request(app.server)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task 1',
        description: 'first ever task',
        recurrenceType: 'MONTHLY',
        taskType: 'TASK',
        dueDate: addDays(new Date(), 2),
      })

    const task = JSON.parse(response.text)

    expect(response.status).toEqual(201)

    expect(task.id).toEqual('2')
    expect(task.organizationId).not.toBeNull()
  })

  it.only('should not be able to create a task without bearer token', async () => {
    const response = await request(app.server)
      .post('/tasks')
      .send({
        title: 'Task 1',
        description: 'first ever task',
        recurrenceType: 'MONTHLY',
        taskType: 'TASK',
        dueDate: addDays(new Date(), 2),
      })

    expect(response.status).toBe(401)
  })
})
