import express from 'express'
import setUpMiddleware from './middlewares'
import setupRoutes from './routes'
import { TaskScheduleAdapter } from '../../utils/TaskScheduleAdapter'

const taskScheduleAdapter = new TaskScheduleAdapter()

taskScheduleAdapter.run('* * * * *', 'running my task')

const app = express()
setUpMiddleware(app)
setupRoutes(app)
export { app }