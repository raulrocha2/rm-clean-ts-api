import request from "supertest"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongoHelper"
import { app } from "../config/app"


beforeAll(async () => {
  await MongoHelper.connect('mongodb://localhost:27017/test')
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  const accountCollection = MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

describe('Sign Up Routes', () => {
  test('Should return an accounts on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho',
        password: '123',
        passWordConfirmation: '123'
      })
      .expect(200)

  })
})