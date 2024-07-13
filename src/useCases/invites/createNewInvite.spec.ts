import { InMemoryInvitesRepository } from "@/repositories/invites/inMemory/inMemoryInvitesRepository";
import { beforeEach, describe, it } from "vitest";
import { CreateNewInviteUseCase } from "./createNewInvite";

let invitesRepository: InMemoryInvitesRepository;
let sut: CreateNewInviteUseCase;

describe("Invte User Use Case", () => {
  beforeEach(() => {
    invitesRepository = new InMemoryInvitesRepository();
    sut = new CreateNewInviteUseCase(invitesRepository);
  });

  it("organizations owner should be able to invite users", async () => {});
});
