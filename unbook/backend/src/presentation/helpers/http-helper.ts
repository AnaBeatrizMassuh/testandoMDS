import { ServerError } from "../errors/server-errors";
import { IHttpResponse } from "../protocols/http";
import { IAddAccountModel } from "../protocols/signup-protocols";

const badRequest = (error: Error): IHttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};

const serverError = (): IHttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};

const ok = (data: IAddAccountModel): IHttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};

export { badRequest, serverError, ok };
