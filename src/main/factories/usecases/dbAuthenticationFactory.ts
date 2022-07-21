import env from '../../config/env'
import { DbAuthentication } from '../../../data/authentication/DbAuthentication'
import { IAuthentication } from '../../../domain/useCases/IAuthentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/BcryptAdapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwtAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'

export const dbAuthenticationFactory = (): IAuthentication => {
  const salt = 10
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
