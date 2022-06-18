import { resolve } from "path"
import { IAuthenticationModel } from "../../domain/useCases/IAuthentication"
import { IHashComparer } from "../protocols/criptography/IHashComparer"
import { ITokenGenerator } from "../protocols/criptography/ITokenGenerator"
import { ILoadAccountByEmailRepository } from "../protocols/db/ILoadAccountByEmailRepository"

import { IAccountModel, IAddAccountModel } from "../useCases/addAccount/dbAddAccountProtocols"
import { DbAuthentication } from "./DbAuthentication"


const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAccountModel> {
      const account = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'any_id_123',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})


type SutTypes = {
  loadAccountByEmailRepository: ILoadAccountByEmailRepository,
  sut: DbAuthentication,
  hashComparerStub: IHashComparer,
  tokenGeneratorStub: ITokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub
  )
  return {
    loadAccountByEmailRepository,
    sut,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('DbAuthentication UseCase', () => {

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null with LoadAccountByEmailRepository return null', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { hashComparerStub, sut } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { hashComparerStub, sut } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null with HashComparer return false', async () => {
    const { hashComparerStub, sut } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct ID', async () => {
    const { tokenGeneratorStub, sut } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id_123')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { tokenGeneratorStub, sut } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

})