import { InvalidParamError, MissingParamError } from "../../error";
import { IEmailValidator } from "../../protocols/IEmailValidator";
import { IValidation } from "../../protocols/IValidation";

export class EmailFieldValidation implements IValidation {

  constructor(
    private fieldName: string,
    private emailValidator: IEmailValidator
  ) { }
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }

}