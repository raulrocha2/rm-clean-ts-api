import { MongoHelper } from "../helpers/mongoHelper"
import { AccountMongoRepository } from "./AccountMongoRepository"


describe('Account Mongo Repository', () => {


  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/test')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {

    const sut = new AccountMongoRepository()
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
})