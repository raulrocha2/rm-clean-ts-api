import { MissingParamError } from "../../error";
import { IValidation } from "../../protocols/IValidation";

export class RequiredFieldValidation implements IValidation {

  constructor(
    private fieldName: string
  ) { }
  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }

}