import express from 'express'
import setUpMiddleware from './middlewares'
import setupRoutes from './routes'
import { TaskScheduleAdapter } from '../../utils/TaskScheduleAdapter'

const taskScheduleAPI = new TaskScheduleAdapter()
const taskScheduleEmail = new TaskScheduleAdapter()

taskScheduleAPI.run('* * * * *', 'running my task')
taskScheduleEmail.run('*/2 * * * *', 'send email')

const app = express()
setUpMiddleware(app)
setupRoutes(app)
export { app }