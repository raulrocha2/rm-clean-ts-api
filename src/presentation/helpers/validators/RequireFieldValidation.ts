import { MissingParamError } from "../../error";
import { IValidation } from "./IValidation";

export class RequireFieldValidation implements IValidation {

  constructor(
    private fieldName: string
  ) { }
  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }

}