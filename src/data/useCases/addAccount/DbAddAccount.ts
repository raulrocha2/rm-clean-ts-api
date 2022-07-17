import {
  IAccountModel,
  IAddAccount, IAddAccountModel,
  IAddAccountRepository,
  IHasher,
  ILoadAccountByEmailRepository
} from './dbAddAccountProtocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) { }

  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    const hashPassword = await this.hasher.hash(accountData.password)
    const accountCreated = await this.addAccountRepository.add(
      Object.assign({}, accountData, {
        password: hashPassword
      })
    )
    return accountCreated
  }
}
