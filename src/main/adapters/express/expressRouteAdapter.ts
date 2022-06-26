import { Request, Response } from "express";
import { IController, IHttpRequest } from "../../../presentation/protocols";


export const expressRouteAdapter = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}