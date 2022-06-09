import { MissingParamError } from "../../../error";
import { badRequest } from "../../../helpers/httpHelper";
import { IHttpRequest, IHttpResponse, IController } from "../../../protocols";


export class LoginController implements IController {

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }

}