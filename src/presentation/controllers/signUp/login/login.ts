import { InvalidParamError, MissingParamError } from "../../../error";
import { badRequest, serverError, unauthorized } from "../../../helpers/httpHelper";
import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAuthentication } from "./LoginProtocols";



export class LoginController implements IController {

  constructor(
    private emailValidator: IEmailValidator,
    private authentication: IAuthentication
  ) { }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))

      }

      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }

}