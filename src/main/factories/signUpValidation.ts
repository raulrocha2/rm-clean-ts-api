
import {
  CompareFieldsValidation,
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from "../../presentation/helpers/validators";
import { IValidation } from "../../presentation/protocols/IValidation";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdapter";


export const makeSignUpValidation = (): ValidationComposite => {


  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)

}