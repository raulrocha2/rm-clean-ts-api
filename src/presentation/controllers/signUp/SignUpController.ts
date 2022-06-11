import { InvalidParamError, MissingParamError } from "../../error"
import { badRequest, ok, serverError } from "../../helpers/httpHelper"
import { IAddAccount, IController, IEmailValidator, IHttpRequest, IHttpResponse, IValidation } from "./signUpProtocols"



export class SignUpController implements IController {



  constructor(
    private emailValidator: IEmailValidator,
    private addAccount: IAddAccount,
    private validation: IValidation
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {

      this.validation.validate(httpRequest.body)
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