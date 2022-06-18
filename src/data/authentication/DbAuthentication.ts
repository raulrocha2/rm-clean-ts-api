import { IAuthentication } from "../../domain/useCases/IAuthentication";

import {
  IAuthenticationModel,
  IHashComparer,
  ILoadAccountByEmailRepository,
  ITokenGenerator,
  IUpdateAccessTokenRepository
} from "./DbAuthenticationProtocols"


export class DbAuthentication implements IAuthentication {
  constructor(
    private loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private hashComparer: IHashComparer,
    private tokenGenerator: ITokenGenerator,
    private updateAccessToken: IUpdateAccessTokenRepository
  ) { }

  async auth({ email, password }: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isValid = await this.hashComparer.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessToken.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}