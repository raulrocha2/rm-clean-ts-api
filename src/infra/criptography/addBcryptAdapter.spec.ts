import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash-to-mock'))
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hashCreated = await sut.encrypt('hash-to-mock')

    expect(hashCreated).toBe('hash-to-mock')
  })

  // test('Should throw if bcrypt throws Error', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
  //     new Promise((_resolve, reject) => reject(new Error()))
  //   )
  //   const promise = sut.encrypt('any_value')

  //   await expect(promise).rejects.toThrow()
  // })
})