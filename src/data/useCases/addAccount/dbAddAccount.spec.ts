import { DbAddAccount } from "./DbAddAccount";
import { IAccountModel, IAddAccountModel, IAddAccountRepository, IEncrypter } from "./dbAddAccountProtocols";

class EncrypterStub implements IEncrypter {
  async encrypt(value: string): Promise<string> {
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
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
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
  test('Should call Encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  });

  test('Should throw if Encrypt throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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