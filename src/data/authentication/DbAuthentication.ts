import { IAuthentication, IAuthenticationModel } from "../../domain/useCases/IAuthentication";
import { IHashComparer } from "../protocols/criptography/IHashComparer";
import { ILoadAccountByEmailRepository } from "../protocols/db/ILoadAccountByEmailRepository";


export class DbAuthentication implements IAuthentication {
  constructor(
    private loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private hashComparer: IHashComparer
  ) { }

  async auth({ email, password }: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      await this.hashComparer.compare(password, account.password)
    }
    return null
  }
}