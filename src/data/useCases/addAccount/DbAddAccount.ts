import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IHasher } from "./dbAddAccountProtocols"



export class DbAddAccount implements IAddAccount {

  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) { }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashPassword = await this.hasher.hash(accountData.password)
    const accountCreated = await this.addAccountRepository.add(
      Object.assign({}, accountData, {
        password: hashPassword
      })
    )
    return accountCreated
  }

}