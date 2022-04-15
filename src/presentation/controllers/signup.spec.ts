import { InvalidParamError, MissingParamError, ServerError } from "../error";
import { IEmailValidator } from "../protocols";
import { SignUpController } from "./SignUpController"

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  });

  test('Should return 400 if no email is provided', () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  });

  test('Should return 400 if no password is provided', () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  });

  test('Should return 400 if no password confirmation is provided', () => {
    //System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  });

  test('Should return 400 if an invalid email is provided', () => {
    //System Under Test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  });

  test('Should call EmailValidator with correct email', () => {
    //System Under Test
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  });

  test('Should return 500 if EmailValidator throws Error', () => {

    const emailValidatorStub = makeEmailValidatorWithError()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  });
})