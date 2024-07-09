import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { describe, expect, it } from "vitest";
import { CreateNewUserUseCase } from "./createNewUser";
import { EmailAlreadyInUse } from "./erros/EmailAlreadyInUseError";

describe("Create New User Use Case", () => {
  it("should be able to create a new user", async () => {
    const repository = new InMemoryUsersRepository();
    const useCase = new CreateNewUserUseCase(repository);

    const { user } = await useCase.execute({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register using same email twice", async () => {
    const repository = new InMemoryUsersRepository();
    const useCase = new CreateNewUserUseCase(repository);

    await useCase.execute({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
    });

    await expect(() =>
      useCase.execute({
        name: "Mary Jane",
        email: "mj@dailyplanet.com",
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUse);
  });
});
