import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'

export const makeLogController = (controller: IController): IController => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
