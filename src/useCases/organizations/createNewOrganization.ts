import { IOrganizationsRepository } from "@/repositories/organizations/IOrganizationsRepository";
import { Organization } from "@prisma/client";

interface CreateNewOrganizationRequest {
  name: string;
  fantasyName: string;
  cnpj: string;
  ownerId: string;
}

interface CreateNewOrganizationResponse {
  organization: Organization;
}

export class CreateNewOrganizationUseCase {
  constructor(private organizationsRepository: IOrganizationsRepository) {}

  async execute({
    name,
    fantasyName,
    cnpj,
    ownerId,
  }: CreateNewOrganizationRequest): Promise<CreateNewOrganizationResponse> {
    const organization = await this.organizationsRepository.create({
      name,
      fantasyName,
      cnpj,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    });

    return { organization };
  }
}
