import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import articleRoutes from './features/articles/article.route'
import categoryRoutes from './features/categories/category.route'
import { UserRoutes } from './features/users/user.route'
import ErrorHandler from './middlewares/error.middleware'
import { HttpException } from './utils/HttpExceptions'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev')) // Logs requests to the console

// Routes
app.use('/api/articles', articleRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', UserRoutes)

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpException(404, 'Route not found'))
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  ErrorHandler(err, _req, res, _next)
})

export default app
