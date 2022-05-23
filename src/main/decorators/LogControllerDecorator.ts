import { ILogErrorRepository } from "../../data/protocols/ILogErrorRepository"
import { IController, IHttpRequest, IHttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly logErrorRepository: ILogErrorRepository

  constructor(controller: IController, logError: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logError
  }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}
