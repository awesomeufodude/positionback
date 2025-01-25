import Joi from 'joi'

export const articleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Page must be a number.',
    'number.integer': 'Page must be an integer.',
    'number.min': 'Page must be at least 1.',
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Limit must be a number.',
    'number.integer': 'Limit must be an integer.',
    'number.min': 'Limit must be at least 1.',
  }),
  category: Joi.string().optional().messages({
    'string.base': 'Category must be a string.',
  }),
  isFavorite: Joi.boolean().optional().messages({
    'boolean.base': 'isFavorite must be a boolean.',
  }),
  minRating: Joi.number().min(0).optional().messages({
    'number.base': 'minRating must be a number.',
    'number.min': 'minRating must be at least 0.',
  }),
})
