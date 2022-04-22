import { DbAddAccount } from "./DbAddAccount";
import { IAccountModel, IAddAccountModel, IAddAccountRepository, IEncrypter } from "./dbAddAccountProtocols";

class EncrypterStub implements IEncrypter {
  async encrypt(value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

class AddAccountRepositoryStub implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const fakeAccount = {
      id: 'new_id',
      name: 'new_account',
      email: 'new_email@mail.com',
      password: 'hashed_password'
    }
    return new Promise(resolve => resolve(fakeAccount))
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

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  });

  test('Should throw if Encrypt throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'new_account',
      email: 'new_email@mail.com',
      password: 'new_password'
    }
    await sut.add(accountData)
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
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'new_name',
      email: 'new_email@mail.com',
      password: 'new_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'new_id',
      name: 'new_account',
      email: 'new_email@mail.com',
      password: 'hashed_password'
    })
  });

})