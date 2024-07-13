import { IOrganizationsRepository } from "@/repositories/organizations/IOrganizationsRepository";
import { Organization } from "@prisma/client";
import { CnpjAlreadyInUseError } from "./errors/CnpjAlreadyInUseError";
import { CnpjLengthError } from "./errors/CnpjLengthError";

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
    if (cnpj.length !== 14) throw new CnpjLengthError();

    const organizationWithSameCnpj =
      await this.organizationsRepository.findByCnpj(cnpj);
    if (organizationWithSameCnpj) throw new CnpjAlreadyInUseError();

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
