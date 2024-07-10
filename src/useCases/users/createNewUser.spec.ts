import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateNewUserUseCase } from "./createNewUser";
import { EmailAlreadyInUse } from "./errors/EmailAlreadyInUseError";

let usersRepository: InMemoryUsersRepository;
let sut: CreateNewUserUseCase;

describe("Create New User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateNewUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const { user } = await sut.execute({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register using same email twice", async () => {
    await sut.execute({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Mary Jane",
        email: "mj@dailyplanet.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUse);
  });
});
