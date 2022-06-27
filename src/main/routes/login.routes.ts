import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../factories/login/loginFactory'
import { makeSignUpController } from '../factories/signup/signUpFactory'


export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}