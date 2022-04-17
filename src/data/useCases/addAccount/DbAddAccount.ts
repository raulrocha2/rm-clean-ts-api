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
    const accountCreated = await this.addAccountRepository.add(
      Object.assign({}, accountData, {
        password: hashPassword
      })
    )
    return accountCreated
  }

}