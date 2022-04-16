import { IAddAccount } from "../../domain/useCases/IAddAccount"
import { InvalidParamError, MissingParamError } from "../error"
import { badRequest, serverError } from "../helpers/httpHelper"
import { IHttpRequest, IHttpResponse, IEmailValidator, IController } from "../protocols"


export class SignUpController implements IController {

  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount

  constructor(
    emailValidator: IEmailValidator,
    addAccount: IAddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }
  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirm } = httpRequest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

    } catch (error) {
      return serverError()
    }
  }

}