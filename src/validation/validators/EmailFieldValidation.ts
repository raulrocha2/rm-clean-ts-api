import { InvalidParamError } from '../../presentation/error'
import { IEmailValidator } from '../protocols/IEmailValidator'
import { IValidation } from '../../presentation/protocols'

export class EmailFieldValidation implements IValidation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) { }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
