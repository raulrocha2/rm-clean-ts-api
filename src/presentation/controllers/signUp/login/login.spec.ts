import { InvalidParamError, MissingParamError } from "../../../error";
import { badRequest } from "../../../helpers/httpHelper";
import { IEmailValidator, IHttpRequest } from "../signUpProtocols";
import { LoginController } from "./login"


const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@test.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  emailValidatorStub: IEmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}


describe('Login controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@test.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('any_email@test.com');
  })
})