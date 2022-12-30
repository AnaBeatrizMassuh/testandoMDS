import request from "supertest";
import { MongoHelper } from "../../infra/database/mongodb/helpers/mongo-helper";
import { app } from "../../main/config/app";

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    MongoHelper.getCollection("accounts").deleteMany({});
  });

  describe("POST/ signup", () => {
    test("Deve retornar 200 quando o signup tem sucesso", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "any_name",
          email: "any_email@aluno.unb.br",
          password: "any_password",
          passwordConfirmation: "any_password",
        })
        .expect(200);
    });
  });
});
