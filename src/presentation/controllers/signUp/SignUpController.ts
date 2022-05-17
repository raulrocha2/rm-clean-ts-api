import { InvalidParamError, MissingParamError } from "../../error"
import { badRequest, ok, serverError } from "../../helpers/httpHelper"
import { IAddAccount, IController, IEmailValidator, IHttpRequest, IHttpResponse } from "./signUpProtocols"



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
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)

    } catch (error) {
      return serverError(error)
    }
  }

}