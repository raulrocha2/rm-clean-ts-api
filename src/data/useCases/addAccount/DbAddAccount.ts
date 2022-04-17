import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IEncrypter } from "./dbAddAccountProtocols"



export class DbAddAccount implements IAddAccount {

  private readonly encrypter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor(
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository
  ) {
    this.encrypter = encrypter,
      this.addAccountRepository = addAccountRepository
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashPassword = await this.encrypter.encrypt(accountData.password)
    accountData.password = hashPassword
    await this.addAccountRepository.add(accountData)
    return new Promise(resolve => resolve(null))
  }

}