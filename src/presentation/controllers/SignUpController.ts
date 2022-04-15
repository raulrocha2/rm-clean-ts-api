import { MissingParamError } from "../error/MissingParamError"
import { badRequest } from "../helprs/httpHelper"
import { IHttpRequest, IHttpResponse } from "../protocols/http"

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredField = ['name', 'email']
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }

}