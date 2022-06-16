import { IValidation } from "../../protocols/IValidation";

export class ValidationComposite implements IValidation {
  constructor(
    private validations: IValidation[]
  ) { }


  validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }

}