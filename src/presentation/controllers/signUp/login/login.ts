import { InvalidParamError, MissingParamError } from "../../../error";
import { badRequest, serverError } from "../../../helpers/httpHelper";
import { IHttpRequest, IHttpResponse, IController } from "../../../protocols";
import { IEmailValidator } from "../signUpProtocols";


export class LoginController implements IController {

  constructor(
    private emailValidator: IEmailValidator
  ) { }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {

      const { email, password } = httpRequest.body
      if (!email) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }

      if (!password) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))

      }
    } catch (error) {
      return serverError(error)
    }
  }

}