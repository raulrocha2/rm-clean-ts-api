import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/expressRouteAdapter'
import { makeSignUpController } from '../factories/signup/signUpFactory'


export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
}