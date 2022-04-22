import bcrypt, { hash } from 'bcrypt'
import { resolve } from 'path'
import { BcryptAdapter } from './BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash-to-mock'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashCreated = await sut.encrypt('hash-to-mock')

    expect(hashCreated).toBe('hash-to-mock')
  })
})