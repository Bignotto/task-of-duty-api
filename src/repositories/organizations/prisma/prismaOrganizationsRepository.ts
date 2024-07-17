import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { IOrganizationsRepository } from "../IOrganizationsRepository";

export class PrismaOrganizationsRepository implements IOrganizationsRepository {
  async findByCnpj(cnpj: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        cnpj,
      },
    });
    return organization;
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({ data });
    return organization;
  }

  async findById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    });
    return organization;
  }
}
