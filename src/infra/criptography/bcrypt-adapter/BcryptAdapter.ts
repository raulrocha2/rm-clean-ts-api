
import bcrypt from 'bcrypt';
import { IHashComparer, IHasher } from '../../../data/authentication/DbAuthenticationProtocols';


export class BcryptAdapter implements IHasher, IHashComparer {


  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {

    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid;
  }
}