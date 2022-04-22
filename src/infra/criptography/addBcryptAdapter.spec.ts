import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt correct valuer', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})