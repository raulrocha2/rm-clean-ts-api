import { SignUpController } from '../../../presentation/controllers/signUp/SignUpController'
import { IController } from '../../../presentation/protocols'
import { makeLogController } from '../decorators/logControllerFactory'
import { dbAddAccountFactory } from '../usecases/dbAddAccountFactory'
import { dbAuthenticationFactory } from '../usecases/dbAuthenticationFactory'
import { makeSignUpValidation } from './signUpValidationFactory'

export const makeSignUpController = (): IController => {
  const controller = new SignUpController(dbAddAccountFactory(), makeSignUpValidation(), dbAuthenticationFactory())
  return makeLogController(controller)
}
