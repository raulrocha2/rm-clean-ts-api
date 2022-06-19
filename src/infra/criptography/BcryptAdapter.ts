
import { IHashComparer, IHasher } from '../../data/authentication/DbAuthenticationProtocols';
import bcrypt from 'bcrypt';


export class BcryptAdapter implements IHasher, IHashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {

    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}