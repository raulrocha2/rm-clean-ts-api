import { IAccountModel, IAddAccountModel } from "../../useCases/addAccount/dbAddAccountProtocols";

export interface IAddAccountRepository {
  add(accountData: IAddAccountModel): Promise<IAccountModel>;
}