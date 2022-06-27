import { hash } from "bcrypt"
import { Collection } from "mongodb"
import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongoHelper"
import { app } from "../config/app"

let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect('mongodb://localhost:27017/test')
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

describe('POST /signup', () => {
  test('Should return 200 on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho@email.com',
        password: '123',
        passwordConfirm: '123'
      })
      .expect(200)

  })
})

describe('POST /login', () => {
  test('Should return 200 on login', async () => {
    const password = await hash('123', 10)
    await accountCollection.insertOne({
      name: 'Rodrigo',
      email: 'rodrigo.manguinho@email.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'rodrigo.manguinho@email.com',
        password: '123'
      })
      .expect(200)
  })

  test('Should return 401 on login', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'rodrigo.manguinho@email.com',
        password: '123'
      })
      .expect(401)

  })
})