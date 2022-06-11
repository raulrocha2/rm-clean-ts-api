import { IAccountModel } from "../../../domain/models/Account";
import { IAddAccount, IAddAccountModel } from "../../../domain/useCases/IAddAccount";
import { InvalidParamError, MissingParamError, ServerError } from "../../error";
import { ok, serverError, badRequest } from "../../helpers/httpHelper";

import { SignUpController } from "./SignUpController"
import { IEmailValidator, IHttpRequest, IValidation } from "./signUpProtocols";

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeAccount = (): IAccountModel => ({

  id: "valid_id",
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'

})

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}


const makeFakeRequest = (): IHttpRequest => ({

  body: {
    name: 'any name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirm: 'any_password'
  }

})

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  });

  test('Should return 400 if no email is provided', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  });

  test('Should return 400 if no password is provided', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))

  });

  test('Should return 400 if no password confirmation is provided', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')))

  });

  test('Should return 400 if no password confirmation fails', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirm')))
  });

  test('Should return 400 if an invalid email is provided', async () => {
    //System Under Test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  });

  test('Should call EmailValidator with correct email', async () => {
    //System Under Test
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  });

  test('Should return 500 if EmailValidator throws Error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      () => { throw new Error }
    )

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(httpResponse.body))

  });

  test('Should call AddAccount with correct values', async () => {
    //System Under Test
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'invalid_email@mail.com',
      password: 'any_password'
    })
  });

  test('Should return 500 if AddAccount throws Error', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(
      async () => {
        return new Promise((resolve, rejects) => rejects(new Error))
      }
    )

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(httpResponse.body))
  });

  test('Should return 201 if valid data Account is provided', async () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  });

  test('Should call Validation with correct values', async () => {
    //System Under Test SUT
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  });

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  });
})