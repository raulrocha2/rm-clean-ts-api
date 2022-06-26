import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/httpHelper";

import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAuthentication } from "./LoginProtocols";



export class LoginController implements IController {

  constructor(
    private authentication: IAuthentication,
    private emailValidator: IEmailValidator
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

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }

}