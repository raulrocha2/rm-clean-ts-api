import { ILoadAccountByEmailRepository } from "../../../../data/authentication/DbAuthenticationProtocols";
import { IAddAccountRepository } from "../../../../data/protocols/db/IAddAccountRepository";
import { IAccountModel } from "../../../../domain/models/Account";
import { IAddAccountModel } from "../../../../domain/useCases/IAddAccount";
import { MongoHelper } from "../helpers/mongoHelper";


export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository {

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultInsert = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(resultInsert.insertedId)

    return MongoHelper.map(account)

  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    });
    if (account) return MongoHelper.map(account)
  }

}