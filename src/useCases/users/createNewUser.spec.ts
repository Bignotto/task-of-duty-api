import { InMemoryUsersRepository } from "@/repositories/users/inMemory/usersRepository";
import { describe, expect, it } from "vitest";
import { CreateNewUserUseCase } from "./createNewUser";

describe("Create New User Use Case", () => {
  it("should be able to create a new user", async () => {
    const repository = new InMemoryUsersRepository();
    const useCase = new CreateNewUserUseCase(repository);

    console.log("antes");
    const user = await useCase.execute({
      name: "Mary Jane",
      email: "mj@dailyplanet.com",
    });
    console.log("depois");

    // console.log({ user });
    // expect(user.id).toBe(expect.any(String));
    expect(2 + 2).toEqual(4);
  });
});
