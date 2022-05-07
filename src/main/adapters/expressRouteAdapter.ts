import { Request, Response } from "express";
import { IController, IHttpRequest, IHttpResponse } from "../../presentation/protocols";

export const expressRouteAdapter = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).send(httpResponse.body)
  }
}