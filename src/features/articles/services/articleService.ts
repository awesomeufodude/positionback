import { Prisma } from '@prisma/client'
import { prisma } from '../../../config/database'
import { Article, CreateArticleInput, ArticleQueryParams, UpdateArticleInput } from '../../../types/articleTypes'
import { HttpException } from '../../../utils/HttpExceptions'

export const ArticleService = {
  getArticles: async (query: ArticleQueryParams): Promise<{ data: Article[]; pagination: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } }> => {
    const { page = 1, limit = 10, category, isFavorite, minRating } = query

    // Validate query parameters
    if (page < 1) throw new HttpException(400, 'Page must be greater than 0.')
    if (limit < 1) throw new HttpException(400, 'Limit must be greater than 0.')

    const skip = (page - 1) * limit
    const take = limit

    const where: Prisma.ArticleWhereInput = {}
    if (category) where.categoryId = category
    if (isFavorite !== undefined) where.isFavorite = isFavorite
    if (minRating !== undefined) where.rating = { gte: minRating }

    const totalArticles = await prisma.article.count({ where })
    const articles = await prisma.article.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        author: true,
      },
    })

    if (articles.length === 0) throw new HttpException(404, 'No articles found.')

    articles.map((article) => (article['author'].password = ''));  

    return {
      data: articles,
      pagination: {
        total: totalArticles,
        page,
        limit,
        totalPages: Math.ceil(totalArticles / limit),
        hasNextPage: page < Math.ceil(totalArticles / limit),
        hasPreviousPage: page > 1,
      },
    }
  },

  // Create a new article
  createArticle: async (data: CreateArticleInput): Promise<Article> => {
    const { categoryId, authorId, title, description, rating } = data

    // Validate required fields
    if (!title || title.trim() === '') throw new HttpException(422, 'Title is required.')
    if (!description || description.trim() === '') throw new HttpException(422, 'Description is required.')
    if (!categoryId) throw new HttpException(422, 'Category ID is required.')
    if (!authorId) throw new HttpException(422, 'Author ID is required.')
    if (rating < 0 || rating > 5) throw new HttpException(422, 'Rating must be between 0 and 5.')

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!categoryExists) throw new HttpException(404, `Category with ID "${categoryId}" not found.`)

    // Check if author exists
    const authorExists = await prisma.user.findUnique({ where: { id: authorId } })
    if (!authorExists) throw new HttpException(404, `Author with ID "${authorId}" not found.`)

    const article = await prisma.article.create({
      data: {
        title,
        description,
        category: {
          connect: { id: categoryId },
        },
        author: {
          connect: { id: authorId },
        },
        rating,
      },
      include: {
        category: true,
        author: true,
      },
    })

    article['author'].password = ''

    return article
  },

  // Update an existing article
  updateArticle: async (id: string, data: UpdateArticleInput): Promise<Article> => {
    const { categoryId, authorId, rating, ...updateData } = data

    // Check if the article exists
    const articleExists = await prisma.article.findUnique({ where: { id } })
    if (!articleExists) throw new HttpException(404, `Article with ID "${id}" not found.`)

    // Validate optional fields
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!categoryExists) throw new HttpException(404, `Category with ID "${categoryId}" not found.`)
    }

    if (authorId) {
      const authorExists = await prisma.user.findUnique({ where: { id: authorId } })
      if (!authorExists) throw new HttpException(404, `Author with ID "${authorId}" not found.`)
    }

    if (rating !== undefined) {
      if (rating < 0 || rating > 5) throw new HttpException(422, 'Rating must be between 0 and 5.')
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        ...(rating !== undefined ? { rating } : 0),
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        ...(authorId ? { author: { connect: { id: authorId } } } : {}),
      },
      include: {
        category: true,
        author: true,
      },
    })

    updatedArticle['author'].password = ''

    return updatedArticle
  },

  // Rate an article
  rateArticle: async (id: string, rating: number): Promise<Article> => {
    // Validate rating
    if (rating < 0 || rating > 5) throw new HttpException(422, 'Rating must be between 0 and 5.')

    // Check if the article exists
    const articleExists = await prisma.article.findUnique({ where: { id } })
    if (!articleExists) throw new HttpException(404, `Article with ID "${id}" not found.`)

    return await prisma.article.update({
      where: { id },
      data: { rating },
    })
  },

  // Toggle the favorite status of an article
  toggleFavorite: async (id: string): Promise<Article> => {
    const article = await prisma.article.findUnique({ where: { id } })

    if (!article) {
      throw new HttpException(404, 'Article not found.')
    }

    return await prisma.article.update({
      where: { id },
      data: { isFavorite: !article.isFavorite },
    })
  },

  // Get a single article by ID
  getArticleById: async (id: string): Promise<Article | null> => {
    if (!id) throw new HttpException(400, 'Article ID is required.')

    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true, author: true },
    })

    if (!article) {
      throw new HttpException(404, `Article with ID "${id}" not found.`)
    }

    article['author'].password = ''

    return article
  },

  // Delete an article by ID
  deleteArticle: async (id: string): Promise<Article> => {
    // Check if the article exists
    const articleExists = await prisma.article.findUnique({ where: { id } })
    if (!articleExists) throw new HttpException(404, `Article with ID "${id}" not found.`)

    return await prisma.article.delete({
      where: { id },
    })
  },

  // Get articles for a category and its subcategories
  getArticlesByCategory: async (categoryId: string): Promise<Article[]> => {
    if (!categoryId) throw new HttpException(400, 'Category ID is required.')

    // Fetch all subcategories for the given category ID
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { id: categoryId }, // Include the main category
          { parentId: categoryId }, // Include its subcategories
        ],
      },
      select: { id: true }, // Select only the category IDs
    })

    const categoryIds = categories.map((category) => category.id)

    const articles = await prisma.article.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      include: {
        category: true, // Include category details
        author: true, // Include author details
      },
    })
    articles.map((article) => {
      article['author'].password = ''
    })
    return articles
  },
}
