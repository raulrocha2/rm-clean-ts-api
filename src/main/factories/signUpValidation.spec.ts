import { CompareFieldsValidation } from "../../presentation/helpers/validators/CompareFieldsValidation";
import { EmailFieldValidation } from "../../presentation/helpers/validators/EmailFieldValidation";
import { IValidation } from "../../presentation/helpers/validators/IValidation";
import { RequireFieldValidation } from "../../presentation/helpers/validators/RequireFieldValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";
import { IEmailValidator } from "../../presentation/protocols/IEmailValidator";
import { makeSignUpValidation } from "./signUpValidation";


jest.mock('../../presentation/helpers/validators/ValidationComposite')


const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequireFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})