import express from 'express'
import setUpMiddleware from './middlewares'
import setupRoutes from './routes'

const app = express()
setUpMiddleware(app)
setupRoutes(app)
export { app }
