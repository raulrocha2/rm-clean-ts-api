import { CompareFieldsValidation } from "../../presentation/helpers/validators/CompareFieldsValidation";
import { EmailFieldValidation } from "../../presentation/helpers/validators/EmailFieldValidation";
import { IValidation } from "../../presentation/helpers/validators/IValidation";
import { RequireFieldValidation } from "../../presentation/helpers/validators/RequireFieldValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdapter";


export const makeSignUpValidation = (): ValidationComposite => {


  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequireFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)

}