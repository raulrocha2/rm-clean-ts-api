import { IValidation } from "../../presentation/helpers/validators/IValidation";
import { RequireFieldValidation } from "../../presentation/helpers/validators/RequireFieldValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";
import { makeSignUpValidation } from "./signUpValidation";


jest.mock('../../presentation/helpers/validators/ValidationComposite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequireFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})