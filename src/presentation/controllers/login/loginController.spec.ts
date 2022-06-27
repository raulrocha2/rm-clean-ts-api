import { InvalidParamError, MissingParamError } from "../../error";
import { IEmailValidator, IHttpRequest, IAuthentication, IAuthenticationModel } from "./LoginProtocols";
import { LoginController } from "./loginController"
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/httpHelper";
import { IValidation } from "../signUp/signUpProtocols";



const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}


const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@test.com',
    password: 'any_password'
  }
})


const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController;
  authenticationStub: IAuthentication;
  validationStub: IValidation;
}


const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}


describe('Login controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('email'))
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('password'))
    const httpRequest = {
      body: {
        email: 'any_email@test.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  })

  test('Should call EmailValidator with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest());
    expect(validateSpy).toHaveBeenCalledWith({
      email: "any_email@test.com",
      password: "any_password"
    });
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuthSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest());
    expect(isAuthSpy).toHaveBeenCalledWith({
      email: 'any_email@test.com',
      password: 'any_password'
    });
  })

  test('Should return 401 if an invalid credential are provider', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  })

  test('Should return 200 if an valid credential are provider', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  })
})