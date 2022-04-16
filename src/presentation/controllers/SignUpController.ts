import { InvalidParamError, MissingParamError } from "../error"
import { badRequest, serverError } from "../helpers/httpHelper"
import { IHttpRequest, IHttpResponse, IEmailValidator, IController } from "../protocols"


export class SignUpController implements IController {

  private readonly emailValidator: IEmailValidator

  constructor(
    emailValidator: IEmailValidator
  ) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirm } = httpRequest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }

}