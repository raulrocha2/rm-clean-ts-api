import { ILoadAccountByEmailRepository } from "../protocols/ILoadAccountByEmailRepository"
import { IAccountModel, IAddAccountModel } from "../useCases/addAccount/dbAddAccountProtocols"
import { DbAuthentication } from "./DbAuthentication"

describe('DbAuthentication UseCase', () => {

  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAddAccountModel> {
      const account: IAccountModel = {
        id: 'any_id_123',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
      return new Promise(resolve => resolve(account))
    }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})