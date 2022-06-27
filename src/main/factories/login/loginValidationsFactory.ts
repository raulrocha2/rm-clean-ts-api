import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/helpers/validators"
import { IValidation } from "../../../presentation/protocols/IValidation"
import { EmailValidatorAdapter } from "../../adapters/validators/EmailValidatorAdapter"

export const makeLoginValidation = (): ValidationComposite => {

  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)

}