import { IAccountModel } from "../../useCases/addAccount/dbAddAccountProtocols";


export interface ILoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<IAccountModel>
}