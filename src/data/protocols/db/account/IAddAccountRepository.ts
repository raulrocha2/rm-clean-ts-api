import { IAccountModel, IAddAccountModel } from '../../../authentication/DbAuthenticationProtocols'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
