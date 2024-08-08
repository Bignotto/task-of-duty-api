import { InMemoryOrganizationsRepository } from "@/repositories/organizations/inMemory/organizationRepository";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Organization } from "@prisma/client";

interface FakeOrganizationProps {
  name?: string;
  fantasyName?: string;
  cnpj?: string;
  ownerId?: string;
}
export async function makeOrg(
  props: FakeOrganizationProps,
  organizationsRepository: InMemoryOrganizationsRepository,
): Promise<Organization> {
  const organization = await organizationsRepository.create({
    name: props.name ?? faker.company.name(),
    fantasyName: props.fantasyName ?? faker.company.buzzNoun(),
    cnpj: props.cnpj ?? faker.string.numeric(14),
    owner: { connect: { id: props.ownerId ?? "master" } },
  });

  return organization;
}
