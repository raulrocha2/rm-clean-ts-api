import { MissingParamError } from "../error/MissingParamError"
import { badRequest } from "../helpers/httpHelper"
import { IHttpRequest, IHttpResponse } from "../protocols/http"
import { IController } from "../protocols/IController"

export class SignUpController implements IController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredField = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }

}