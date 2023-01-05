import { IValidation } from "../../../presentation/protocols/IValidation";
import { IFieldValidation } from "../../protocols/IFieldValidation";

class ValidationComposite implements IValidation {
	private constructor(private readonly validators: IFieldValidation[]) {}

	static build(validators: IFieldValidation[]): ValidationComposite {
		return new ValidationComposite(validators);
	}
	validate(fieldName: string, fieldValue: string): string {
		const validators = this.validators.filter(
			(validator) => validator.field === fieldName
		);
		for (const validator of validators) {
			const error = validator.validate(fieldValue);
			if (error) {
				return error.message;
			}
		}
	}
}

export { ValidationComposite };
