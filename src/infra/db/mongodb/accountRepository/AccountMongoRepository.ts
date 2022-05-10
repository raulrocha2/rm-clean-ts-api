import { IAddAccountRepository } from "../../../../data/protocols/IAddAccountRepository";
import { IAccountModel } from "../../../../domain/models/Account";
import { IAddAccountModel } from "../../../../domain/useCases/IAddAccount";
import { MongoHelper } from "../helpers/mongoHelper";


export class AccountMongoRepository implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultInsert = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(resultInsert.insertedId)

    return MongoHelper.map(account)

  }

}