import express from 'express'
import { getArticles, createArticle, updateArticle, rateArticle, toggleFavorite, getArticleById, deleteArticle, getArticlesByCategory } from '../controllers/articleController'
import { authenticate } from '../../../middlewares/authenticate'
import { articleQuerySchema } from '../../../validations/articleValidation'
import { validateQuery } from '../../../middlewares/validateQuery'
import { asyncWrapper } from '../../../utils/asyncWrapper'

const router = express.Router()

// Routes
router.get('/', authenticate,validateQuery(articleQuerySchema), getArticles)
router.post('/', authenticate, createArticle)
router.put('/:id', authenticate, updateArticle)
router.patch('/:id/rate', authenticate, rateArticle)
router.patch('/:id/favorite', authenticate, toggleFavorite)
router.get('/:id', authenticate, getArticleById)
router.delete('/:id', authenticate, deleteArticle)
router.get('/categories/:categoryId',authenticate, getArticlesByCategory)

export default router
