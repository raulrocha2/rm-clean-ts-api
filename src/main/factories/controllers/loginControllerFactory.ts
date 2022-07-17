import { LoginController } from '../../../presentation/controllers/login/loginController'
import { IController } from '../../../presentation/protocols'
import { makeLogController } from '../decorators/logControllerFactory'
import { dbAuthenticationFactory } from '../usecases/dbAuthenticationFactory'
import { makeLoginValidation } from './loginValidationsFactory'

export const makeLoginController = (): IController => {
  const controller = new LoginController(dbAuthenticationFactory(), makeLoginValidation())
  return makeLogController(controller)
}
