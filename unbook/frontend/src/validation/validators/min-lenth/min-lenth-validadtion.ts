import { InvalidParamError } from "../../errors/invalid-param-error";
import { IFielValidation } from "../../protocols/IFieldValidation";

class MinLengthValidation implements IFielValidation {
	constructor(readonly field: string, private readonly minLength: number) {
		this.field = field;
	}
	validate(value: string): Error {
		return new InvalidParamError(this.field);
	}
}

export { MinLengthValidation };
