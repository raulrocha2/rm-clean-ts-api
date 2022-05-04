import request from "supertest"
import { app } from "../config/app"

describe('Sign Up Routes', () => {
  test('Should return an accounts on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: '',
        email: '',
        password: '',
        passWordConfirmation: ''
      })
      .expect(200)

  })
})