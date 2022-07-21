import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation/validators'
import { IValidation } from '../../../presentation/protocols/IValidation'
import { EmailValidatorAdapter } from '../../../infra/validators/EmailValidatorAdapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
