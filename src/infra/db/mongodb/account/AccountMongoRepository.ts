import { ObjectId } from "mongodb";
import {
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository
} from "../../../../data/authentication/DbAuthenticationProtocols";

import { IAccountModel } from "../../../../domain/models/Account";
import { IAddAccountModel } from "../../../../domain/useCases/IAddAccount";
import { MongoHelper } from "../helpers/mongoHelper";


export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository {
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

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'accessToken': token } }
    )
  }


}