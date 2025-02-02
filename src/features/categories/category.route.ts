import express from 'express'

import { authenticate } from '../../middlewares/auth.middleware'

import {
  createCategory,
  deleteCategory,
  getArticlesByCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from './category.controller'
import { asyncWrapper } from '../../utils/asyncWrapper'

const router = express.Router()

router.get('/', authenticate, getCategories)
router.get('/:id', authenticate, getCategoryById)
router.post('/', authenticate, createCategory)
router.put('/:id', authenticate, updateCategory)
router.delete('/:id', authenticate, deleteCategory)

router.get('/:id/articles', authenticate, getArticlesByCategory)

export default router
