import { IAuthentication, IAuthenticationModel } from "../../domain/useCases/IAuthentication";
import { ILoadAccountByEmailRepository } from "../protocols/db/ILoadAccountByEmailRepository";


export class DbAuthentication implements IAuthentication {
  constructor(
    private loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) { }

  async auth({ email, password }: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(email)
    return null
  }
}