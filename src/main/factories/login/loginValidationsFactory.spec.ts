import { CompareFieldsValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/helpers/validators"
import { IEmailValidator } from "../../../presentation/protocols/IEmailValidator"
import { IValidation } from "../../../presentation/protocols/IValidation"
import { makeLoginValidation } from "./loginValidationsFactory"


jest.mock("../../../presentation/helpers/validators/ValidationComposite")

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})