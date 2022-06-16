import { IAuthenticationModel } from "../../domain/useCases/IAuthentication"
import { ILoadAccountByEmailRepository } from "../protocols/ILoadAccountByEmailRepository"
import { IAccountModel, IAddAccountModel } from "../useCases/addAccount/dbAddAccountProtocols"
import { DbAuthentication } from "./DbAuthentication"

class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
  async load(email: string): Promise<IAddAccountModel> {
    const account = makeFakeAccount()
    return new Promise(resolve => resolve(account))
  }
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAddAccountModel> {
      const account = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'any_id_123',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  loadAccountByEmailRepository: ILoadAccountByEmailRepository,
  sut: DbAuthentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return {
    loadAccountByEmailRepository,
    sut
  }
}

describe('DbAuthentication UseCase', () => {

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.c')
  })
})