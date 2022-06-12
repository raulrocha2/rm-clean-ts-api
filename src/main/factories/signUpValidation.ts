import { IValidation } from "../../presentation/helpers/validators/IValidation";
import { RequireFieldValidation } from "../../presentation/helpers/validators/RequireFieldValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";


export const makeSignUpValidation = (): ValidationComposite => {

  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequireFieldValidation(field))
  }

  return new ValidationComposite(validations)

}