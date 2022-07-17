/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../factories/controllers/loginControllerFactory'
import { makeSignUpController } from '../factories/controllers/signUpControllerFactory'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()))
  router.post('/login', expressRouteAdapter(makeLoginController()))
}
