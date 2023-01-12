/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import { MissingParamError } from "../../presentation/errors";
import { IValidation } from "../protocols/IValidation";

class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {
    this.fieldName = fieldName;
  }
  validate(input: any): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}

export { RequiredFieldValidation };
