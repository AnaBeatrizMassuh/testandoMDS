import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { ServerError } from "../errors/server-errors";
import { badRequest } from "../helpers/http-helper";
import { IController } from "../protocols/controller";
import { IEmailValidator } from "../protocols/email-validator";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator;

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}

export { SignUpController };
