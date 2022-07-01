import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongoHelper"
import { AccountMongoRepository } from "./AccountMongoRepository"


let accountCollection: Collection

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/clean-api-test')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  }

  test('Should return an account on add success', async () => {

    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {

    const sut = makeSut()
    await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {

    const sut = makeSut()
    const res = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(res.accessToken).toBeFalsy()
    await sut.updateAccessToken(res.id, 'any_token')
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account.accessToken).toBe('any_token')

  })

})