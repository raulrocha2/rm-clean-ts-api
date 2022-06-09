import { MissingParamError } from "../../../error";
import { badRequest } from "../../../helpers/httpHelper";
import { IHttpRequest, IHttpResponse, IController } from "../../../protocols";
import { IEmailValidator } from "../signUpProtocols";


export class LoginController implements IController {

  constructor(
    private emailValidator: IEmailValidator
  ) { }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    this.emailValidator.isValid(httpRequest.body.email)
  }

}