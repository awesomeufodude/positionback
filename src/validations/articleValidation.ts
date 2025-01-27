import Joi from 'joi'

export const articleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).messages({
    'number.base': '"page" must be a number',
    'number.integer': '"page" must be an integer',
    'number.min': '"page" must be at least 1',
  }),
  limit: Joi.number().integer().min(1).messages({
    'number.base': '"limit" must be a number',
    'number.integer': '"limit" must be an integer',
    'number.min': '"limit" must be at least 1',
  }),
  category: Joi.string().optional(),
  isFavorite: Joi.boolean().optional().messages({
    'boolean.base': '"isFavorite" must be a boolean',
  }),
  minRating: Joi.number().min(0).max(5).optional().messages({
    'number.base': '"minRating" must be a number',
    'number.min': '"minRating" must be at least 0',
    'number.max': '"minRating" must be at most 5',
  }),
})
