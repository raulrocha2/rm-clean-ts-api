import { IEncrypter } from "../../data/protocols/cryptography/IEncrypter";
import bcrypt from 'bcrypt';

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {

    return await bcrypt.hash(value, this.salt)
  }
}