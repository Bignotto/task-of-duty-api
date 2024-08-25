import { NotFoundError } from "@/globals/errors/NotFoundError";
import { IOrganizationsRepository } from "@/repositories/organizations/IOrganizationsRepository";
import { IUsersRepository } from "@/repositories/users/IUsersRepository";
import { Organization, UserType } from "@prisma/client";
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
  constructor(
    private organizationsRepository: IOrganizationsRepository,
    private usersRepository: IUsersRepository,
  ) {}

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

    const userFound = await this.usersRepository.findById(ownerId);
    if (!userFound)
      throw new NotFoundError({
        sub: ownerId,
        origin: "CreateNewOrganizationUseCase",
      });

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

    await this.usersRepository.setUserType(ownerId, UserType.ORGANIZATION);
    await this.usersRepository.setUserOrganization(ownerId, organization.id);

    return { organization };
  }
}
