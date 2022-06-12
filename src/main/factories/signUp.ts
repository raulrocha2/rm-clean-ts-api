import { DbAddAccount } from "../../data/useCases/addAccount/DbAddAccount";
import { BcryptAdapter } from "../../infra/criptography/BcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accountRepository/AccountMongoRepository";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentation/controllers/signUp/SignUpController";
import { IController } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdapter";
import { LogControllerDecorator } from "../decorators/LogControllerDecorator";
import { makeSignUpValidation } from "./signUpValidation";


export const makeSignUpController = (): IController => {
  const salt = 8

  const accountMongoRepository = new AccountMongoRepository()
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const logMongoRepository = new LogMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, addAccount, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logMongoRepository)
}