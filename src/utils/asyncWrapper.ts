import { Request, Response, NextFunction } from 'express'

// Wrapper for async route handlers
export const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
