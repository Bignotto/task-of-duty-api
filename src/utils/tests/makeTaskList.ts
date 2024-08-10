import { InMemoryTaskListsRepository } from "@/repositories/taskLists/inMemory/inMemoryTaskListsRepository";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { TaskList } from "@prisma/client";
import { randomUUID } from "node:crypto";

interface FakeTaskListProps {
  creatorId?: string;
  orgId?: string;
  description?: string;
  title?: string;
}
export async function makeTaskList(
  props: FakeTaskListProps,
  taskListsRepository: InMemoryTaskListsRepository,
): Promise<TaskList> {
  const taskList = await taskListsRepository.create({
    creator: {
      connect: {
        id: props.creatorId ?? randomUUID(),
      },
    },
    organization: {
      connect: {
        id: props.orgId,
      },
    },
    description: props.description ?? faker.hacker.phrase(),
    title: props.title ?? faker.hacker.ingverb(),
  });

  return taskList;
}
