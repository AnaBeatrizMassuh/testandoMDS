import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../infra/criptography/BcryptAdapter";

jest.mock("bcrypt", () => {
  return {
    async hash(): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    },

    async compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    },
  };
});

const makeSut = (): BcryptAdapter => {
  const salt = 12;
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("Deve chamar o hash com os valores corretos", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("password");
    expect(hashSpy).toHaveBeenCalledWith("password", 12);
  });

  test("Deve retornar o password criptografado", async () => {
    const sut = makeSut();
    const hashed_password = await sut.hash("password");
    expect(hashed_password).toBe("hashed_password");
  });

  test("Deve retornar um erro quando o hash falhar", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash("password");
    await expect(promise).rejects.toThrow();
  });

  test("Deve chamar o compare com os valores corretos", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("Deve retornar true quando o compare tiver sucesso", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });

  test("Deve retornar false quando o compare falhar", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise((resolve) => resolve(false)));
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(false);
  });

  test("Deve retornar um erro quando o compare falhar", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });
});
