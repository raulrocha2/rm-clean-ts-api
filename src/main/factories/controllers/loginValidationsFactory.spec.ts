
import { IValidation } from '../../../presentation/protocols/IValidation'
import { IEmailValidator } from '../../../validation/protocols/IEmailValidator'
import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation/validators'
import { makeLoginValidation } from './loginValidationsFactory'

jest.mock('../../../validation/validators/ValidationComposite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
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
