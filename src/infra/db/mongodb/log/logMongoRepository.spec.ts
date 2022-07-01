import { Collection } from "mongodb"
import { ILogErrorRepository } from "../../../../data/protocols/db/log/ILogErrorRepository"
import { MongoHelper } from "../helpers/mongoHelper"
import { LogMongoRepository } from "./logMongoRepository"

describe('Log Mongo Repository', () => {

  let errorCollection: Collection

  const makeSut = (): ILogErrorRepository => {
    return new LogMongoRepository()
  }

  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/clean-api-test')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})