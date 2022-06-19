
import { IHasher } from '../../data/authentication/DbAuthenticationProtocols';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements IHasher {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {

    return await bcrypt.hash(value, this.salt)
  }
}