
import { IValidation } from '../../../presentation/protocols/IValidation'
import { IEmailValidator } from '../../../validation/protocols/IEmailValidator'
import { CompareFieldsValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../validation/validators'
import { makeSignUpValidation } from './signUpValidationFactory'

jest.mock('../../../validation/validators/ValidationComposite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
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
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
