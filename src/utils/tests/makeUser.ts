import { User, UserType } from '@prisma/client'

import { InMemoryUsersRepository } from '@/repositories/users/inMemory/usersRepository'
import { fakerPT_BR as faker } from '@faker-js/faker'

interface FakeUserProps {
  orgId?: string
  userType?: UserType
  phone?: string
  email?: string
}

export async function makeUser(
  props: FakeUserProps,
  usersRepository: InMemoryUsersRepository,
): Promise<User> {
  const user = await usersRepository.create({
    email: props.email ?? faker.internet.email(),
    name: faker.person.fullName(),
    phone: props.phone ?? faker.phone.number(),
    passwordHash: 'hashed pass',
    userType: props.userType ?? 'USER',
    partOfOrganization: {
      connect: {
        id: props.orgId ?? faker.company.name(),
      },
    },
  })
  return user
}
