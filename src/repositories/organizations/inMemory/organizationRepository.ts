import { Organization, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { IOrganizationsRepository } from "../IOrganizationsRepository";

export class InMemoryOrganizationsRepository
  implements IOrganizationsRepository
{
  public items: Organization[] = [];

  async findByCnpj(cnpj: string): Promise<Organization | null> {
    const organization = this.items.find((item) => item.cnpj === cnpj);

    if (!organization) return null;
    return organization;
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization: Organization = {
      id: randomUUID(),
      cnpj: data.cnpj,
      fantasyName: data.fantasyName,
      name: data.name,
      ownerId: `${data.owner.connect?.id}`,
    };

    this.items.push(organization);

    return organization;
  }
}
