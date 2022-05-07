import { DbAddAccount } from "../../data/useCases/addAccount/DbAddAccount";
import { BcryptAdapter } from "../../infra/criptography/BcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accountRepository/AccountMongoRepository";
import { SignUpController } from "../../presentation/controllers/signUp/SignUpController";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdapter";


export const makeSignUpController = (): SignUpController => {
  const salt = 8

  const accountMongoRepository = new AccountMongoRepository()
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(emailValidatorAdapter, addAccount)
}