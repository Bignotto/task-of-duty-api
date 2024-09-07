import { fakerPT_BR as faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface FakeOrgProps {
  name?: string,
  fantasyName?: string,
  cnpj?: string,
  owner?: { connect: { id: string } },
}

export async function createAndAssignOrganization(
  app: FastifyInstance,
  token: string,
  props: FakeOrgProps = {},
) {

  const response = await request(app.server).post('/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: props.name ?? faker.company.name(),
      fantasyName: props.fantasyName ?? faker.company.buzzNoun(),
      cnpj: props.cnpj ?? '56789012345678'
    })

  const organization = response.body;
  return {
    organization,
  }
}
