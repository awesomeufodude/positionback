import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: string // Add the user property (you can adjust the type as needed)
    }
  }
}
