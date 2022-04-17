import { DbAddAccount } from "./DbAddAccount";
import { IEncrypter } from "./dbAddAccountProtocols";

class EncrypterStub implements IEncrypter {
  async encrypt(value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

class SutTypes {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
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
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(
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

})