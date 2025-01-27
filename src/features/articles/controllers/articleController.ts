import { NextFunction, Request, Response } from 'express'
import { ArticleService } from '../services/articleService'
import { ArticleQueryParams, CreateArticleInput, UpdateArticleInput } from '../../../types/articleTypes'
import { HttpException } from '../../../utils/HttpExceptions'

// Fetch articles with pagination and filters
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse and validate query parameters
    const query: ArticleQueryParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      category: req.query.category as string,
      isFavorite: req.query.isFavorite ? req.query.isFavorite === 'true' : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
    }

    if (query.page && query.page < 1) throw new HttpException(400, 'Page must be greater than 0.')
    if ( query.limit && query.limit < 1) throw new HttpException(400, 'Limit must be greater than 0.')

    if (query.page && isNaN(query.page)) {
      throw new HttpException(400, 'Invalid page parameter. Must be a number.')
    }
    if (query.limit && isNaN(query.limit)) {
      throw new HttpException(400, 'Invalid limit parameter. Must be a number.')
    }
    if (query.minRating && isNaN(query.minRating)) {
      throw new HttpException(400, 'Invalid minRating parameter. Must be a number.')
    }

    const result = await ArticleService.getArticles(query)
    res.status(200).json(result)
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.statusCode || 400).json({ message: err.message })
    } else {
      console.error('Unexpected error:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
    next(err) // Pass errors to the global error-handling middleware
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
    const { title, description, categoryId, authorId, rating } = req.body as CreateArticleInput

    if (!title || !description || !categoryId || !authorId) {
      res.status(400).json({ message: 'Missing required fields: title, description, categoryId, authorId' })
      return
    }

    const newArticle = await ArticleService.createArticle({ title, description, categoryId, authorId, rating })
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
