import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/httpHelper";
import { IValidation } from "../signUp/signUpProtocols";

import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAuthentication } from "./LoginProtocols";



export class LoginController implements IController {

  constructor(
    private authentication: IAuthentication,
    private validation: IValidation
  ) { }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

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