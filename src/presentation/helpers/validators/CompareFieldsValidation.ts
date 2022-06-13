import { InvalidParamError, MissingParamError } from "../../error";
import { IValidation } from "./IValidation";

export class CompareFieldsValidation implements IValidation {

  constructor(
    private fieldName: string,
    private fieldToCompareName: string

  ) { }
  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }

  }

}