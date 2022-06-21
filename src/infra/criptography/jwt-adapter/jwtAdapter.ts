import { sign } from "jsonwebtoken";
import { ITokenGenerator } from "../../../data/authentication/DbAuthenticationProtocols";

export class JwtAdapter implements ITokenGenerator {

  constructor(private readonly secret: string) {
    this.secret = secret
  }
  async generate(value: string): Promise<string> {
    const accessToken = await sign({ id: value }, this.secret)
    return accessToken
  }

}