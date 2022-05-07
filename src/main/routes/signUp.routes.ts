import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/expressRouteAdapter'
import { makeSignUpController } from '../factories/signUp'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
}