import { Request, Response, NextFunction } from 'express'

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body)

    if (error) {
      res.status(400).send(error.details)
    } else {
      next()
    }
  }
}
