import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, { abortEarly: false })

    if (error) {
      // Attach the validation error details to `res.locals`
      res.locals.validationError = error.details.map((detail) => detail.message)
      return next(new Error('ValidationError'))
    }

    next()
  }
}
