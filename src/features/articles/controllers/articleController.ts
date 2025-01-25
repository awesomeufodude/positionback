import { NextFunction, Request, Response } from 'express'
import { ArticleService } from '../services/articleService'
import { ArticleQueryParams, CreateArticleInput, UpdateArticleInput } from '../../../types/articleTypes'

// Fetch articles with pagination and filters
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: ArticleQueryParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      category: req.query.category as string,
      isFavorite: req.query.isFavorite ? req.query.isFavorite === 'true' : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
    }

    const articles = await ArticleService.getArticles(query)
    res.status(200).json(articles)
  } catch (err) {
    next(err) // Pass errors to the error-handling middleware
  }
}

// Fetch a single article by ID
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const article = await ArticleService.getArticleById(id)
    if (!article) {
      res.status(404).json({ message: 'Article not found' })
      return
    }
    res.status(200).json(article)
  } catch (err) {
    next(err)
  }
}

// Create a new article
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, categoryId, authorId } = req.body as CreateArticleInput

    if (!title || !description || !categoryId || !authorId) {
      res.status(400).json({ message: 'Missing required fields: title, description, categoryId, authorId' })
      return
    }

    const newArticle = await ArticleService.createArticle({ title, description, categoryId, authorId })
    res.status(201).json(newArticle)
  } catch (err) {
    next(err)
  }
}

// Update an existing article
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body as UpdateArticleInput

    const updatedArticle = await ArticleService.updateArticle(id, data)
    res.status(200).json(updatedArticle)
  } catch (err) {
    next(err)
  }
}

// Rate an article
export const rateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { rating } = req.body

    if (rating === undefined || isNaN(rating)) {
      res.status(400).json({ message: 'Rating must be a valid number' })
      return
    }

    const updatedArticle = await ArticleService.rateArticle(id, rating)
    res.status(200).json(updatedArticle)
  } catch (err) {
    next(err)
  }
}

// Toggle the favorite status of an article
export const toggleFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const updatedArticle = await ArticleService.toggleFavorite(id)
    res.status(200).json(updatedArticle)
  } catch (err) {
    next(err)
  }
}

// Delete an article by ID
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await ArticleService.deleteArticle(id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const getArticlesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params

    if (!categoryId) {
      res.status(400).json({ message: 'Category ID is required' })
      return
    }

    const articles = await ArticleService.getArticlesByCategory(categoryId)

    if (!articles.length) {
      res.status(404).json({ message: 'No articles found for the given category' })
      return
    }

    res.status(200).json(articles)
  } catch (err) {
    next(err) // Pass errors to error-handling middleware
  }
}
