import { Express } from "express"
import { bodyParser } from "../middleware/bodyParser"
import { cors } from "../middleware/cors"

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}