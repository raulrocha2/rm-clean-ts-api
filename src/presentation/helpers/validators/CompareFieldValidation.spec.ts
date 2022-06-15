import { InvalidParamError } from "../../error"
import { CompareFieldsValidation } from "./CompareFieldsValidation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('fieldName', 'fieldToCompareName')
}


describe('Required Field Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      fieldName: 'value_one',
      fieldToCompareName: 'value_wrong'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompareName'))
  })

  test('Should not return a MissingParamError if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      fieldName: 'value_valid',
      fieldToCompareName: 'value_valid'
    })
    expect(error).toBeFalsy()
  })
})