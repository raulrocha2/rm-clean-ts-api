import bcrypt, { compare } from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash-to-mock'))
  },
  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hashCreated = await sut.hash('hash-to-mock')

    expect(hashCreated).toBe('hash-to-mock')
  })

  test('Should throw if hasher throws Error', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
      () => { throw new Error }
    )
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hash_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'hash_value')
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'hash_value')
    expect(isValid).toBe(true)
  })

  test('Should throw if compare throws Error', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
      () => { throw new Error }
    )
    const promise = sut.compare('any_value', 'invalid_value')
    await expect(promise).rejects.toThrow()
  })

  // test('Should return true when compare succeeds', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
  //     new Promise(resolve => resolve(false))
  //   )
  //   const isValid = await sut.compare('any_value', 'invalid_value')
  //   expect(isValid).toBe(false)
  // })

})