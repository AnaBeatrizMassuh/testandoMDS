/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeLogInValidation } from "../../../../src/main/factories/controllers/login/login-validation-factory";
import { IEmailValidator } from "../../../../src/presentation/protocols/signup-protocols";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../src/validation/validators";

jest.mock("../../../../src/validation/validators/ValidationComposite");
const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("LoginValidation Factory", () => {
  test("Deve chamar o ValidationComposite com todas as validações", async () => {
    makeLogInValidation();
    const validations = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
