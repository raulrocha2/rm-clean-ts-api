import { IAddAccountModel } from "../../useCases/addAccount/dbAddAccountProtocols";


export interface ILoadAccountByEmailRepository {
  load(email: string): Promise<IAddAccountModel>
}