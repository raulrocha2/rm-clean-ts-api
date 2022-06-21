import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwtAdapter"

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('jwt-secret')
    const singSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'jwt-secret')
  })
})