import { DbAddAccount } from '../../../data/useCases/addAccount/DbAddAccount'
import { IAddAccount } from '../../../domain/useCases/IAddAccount'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'

export const dbAddAccountFactory = (): IAddAccount => {
  const salt = 8
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository)
}
