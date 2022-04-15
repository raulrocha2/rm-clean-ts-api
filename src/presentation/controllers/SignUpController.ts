import { InvalidParamError } from "../error/InvalidParamError"
import { MissingParamError } from "../error/MissingParamError"
import { badRequest } from "../helpers/httpHelper"
import { IHttpRequest, IHttpResponse } from "../protocols/http"
import { IController } from "../protocols/IController"
import { IEmailValidator } from "../protocols/IEmailValidator"

export class SignUpController implements IController {

  private readonly emailValidator: IEmailValidator

  constructor(
    emailValidator: IEmailValidator
  ) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredField = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }

}