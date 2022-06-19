import { DbAddAccount } from "./DbAddAccount";
import { IAccountModel, IAddAccountModel, IAddAccountRepository, IHasher } from "./dbAddAccountProtocols";

class HasherStub implements IHasher {
  async hash(value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'new_id',
  name: 'new_account',
  email: 'new_email@mail.com',
  password: 'hashed_password'
})

class AddAccountRepositoryStub implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    return new Promise(resolve => resolve(makeFakeAccount()))
  }
}

class SutTypes {
  sut: DbAddAccount;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

const makeFakeAccountData = (): IAddAccountModel => (
  {
    name: 'new_account',
    email: 'new_email@mail.com',
    password: 'valid_password'
  }

)

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.add(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'new_account',
      email: 'new_email@mail.com',
      password: 'hashed_password'
    })
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.add(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual({
      id: 'new_id',
      name: 'new_account',
      email: 'new_email@mail.com',
      password: 'hashed_password'
    })
  });

})