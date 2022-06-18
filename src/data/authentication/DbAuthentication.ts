import { IAuthentication, IAuthenticationModel } from "../../domain/useCases/IAuthentication";
import { IHashComparer } from "../protocols/criptography/IHashComparer";
import { ITokenGenerator } from "../protocols/criptography/ITokenGenerator";
import { ILoadAccountByEmailRepository } from "../protocols/db/ILoadAccountByEmailRepository";


export class DbAuthentication implements IAuthentication {
  constructor(
    private loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private hashComparer: IHashComparer,
    private tokenGenerator: ITokenGenerator
  ) { }

  async auth({ email, password }: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isValid = await this.hashComparer.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}