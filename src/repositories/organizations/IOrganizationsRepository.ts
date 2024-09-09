import { Organization, Prisma } from '@prisma/client'

export interface IOrganizationsRepository {
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
  findByCnpj(cnpj: string): Promise<Organization | null>
  findById(organizationId: string): Promise<Organization | null>
}
