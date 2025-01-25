import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import articleRoutes from './features/articles/routes/articleRoutes'
import categoryRoutes from './features/categories/routes/categoryRoutes'
import { UserRoutes } from './features/users/routes/userRoutes'
import ErrorHandler from './middlewares/errorHandler'
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
  ErrorHandler(err, _req, res, _next);
});



export default app
