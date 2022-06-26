import { IAccountModel } from "../../../authentication/DbAuthenticationProtocols";


export interface ILoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<IAccountModel>
}