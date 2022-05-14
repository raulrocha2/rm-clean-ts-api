import { DbAddAccount } from "../../data/useCases/addAccount/DbAddAccount";
import { BcryptAdapter } from "../../infra/criptography/BcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accountRepository/AccountMongoRepository";
import { SignUpController } from "../../presentation/controllers/signUp/SignUpController";
import { IController } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdapter";
import { LogControllerDecorator } from "../decorators/LogControllerDecorator";


export const makeSignUpController = (): IController => {
  const salt = 8

  const accountMongoRepository = new AccountMongoRepository()
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)
  return new LogControllerDecorator(signUpController)
}