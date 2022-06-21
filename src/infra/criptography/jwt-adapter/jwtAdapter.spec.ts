import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwtAdapter"

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))


describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('jwt-secret')
    const singSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'jwt-secret')
  });

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('jwt-secret')
    const accessToken = await sut.generate('any_id')
    expect(accessToken).toBe('any_token')
  })
})