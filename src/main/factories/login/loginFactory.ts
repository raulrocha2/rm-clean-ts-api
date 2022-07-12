import { DbAuthentication } from '../../../data/authentication/DbAuthentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/BcryptAdapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwtAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository'
import { LoginController } from '../../../presentation/controllers/login/loginController'
import { IController } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { makeLoginValidation } from './loginValidationsFactory'

export const makeLoginController = (): IController => {
  const salt = 10
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  return new LogControllerDecorator(loginController, logMongoRepository)
}
