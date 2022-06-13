import { InvalidParamError } from "../../error"
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

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body;


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