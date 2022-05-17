import { IController, IHttpRequest, IHttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./LogControllerDecorator"


interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: IController
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        statusCode: 200,
        body: {
          name: 'stub_name'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}
const makeSut = (): SutTypes => {

  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Controller Decorator', () => {

  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'stub_name'
      }
    })
  })
})