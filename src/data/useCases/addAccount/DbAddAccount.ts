import { IAccountModel } from "../../../domain/models/Account";
import { IAddAccount, IAddAccountModel } from "../../../domain/useCases/IAddAccount";
import { IEncrypter } from "../../protocols/IEncrypter";


export class DbAddAccount implements IAddAccount {

  private readonly encrypter: IEncrypter

  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }

}