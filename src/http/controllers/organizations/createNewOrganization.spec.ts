import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("E2E Create Organization Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create new organization", async () => {
    await request(app.server).post("/users").send({
      name: "Mary Jane Watson",
      email: "mj@dailybuggle.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "mj@dailybuggle.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    const response = await request(app.server)
      .post("/organizations")
      .send({
        name: "Fake Organization",
        fantasyName: "Fake Org",
        cnpj: "12345678901234",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(201);
    expect(response.body.fantasyName).toEqual("Fake Org");
  });
});
