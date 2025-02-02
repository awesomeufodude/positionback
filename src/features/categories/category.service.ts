import { prisma } from '../../config/database'
import { HttpException } from '../../utils/HttpExceptions'

export const CategoryService = {
  // Get all categories with subcategories
  getCategories: async () => {
    return await prisma.category.findMany({
      where: { parentId: null }, // Top-level categories
      include: {
        children: {
          // Include subcategories
          include: {
            children: true, // Nested subcategories
          },
        },
      },
    })
  },

  // Get a single category by ID with subcategories
  getCategoryById: async (id: string) => {
    if (!id) {
      throw new HttpException(400, 'Category ID is required.')
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true, // Include immediate subcategories
      },
    })

    if (!category) {
      throw new HttpException(404, `Category with ID "${id}" not found.`)
    }

    return category
  },

  // Create a new category
  createCategory: async (data: { name: string; parentId?: string }) => {
    try {
      // Validate required fields
      if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        throw new HttpException(422, 'Name is required and must be a valid string.')
      }

      // Check if a category with the same name already exists
      const duplicateCategory = await prisma.category.findFirst({
        where: { name: data.name }, // Case-insensitive
      })

      if (duplicateCategory) {
        throw new HttpException(409, `Category with the name "${data.name}" already exists.`)
      }

      // If parentId is provided, validate it exists
      if (data.parentId) {
        const parentExists = await prisma.category.findUnique({
          where: { id: data.parentId },
        })

        if (!parentExists) {
          throw new HttpException(422, `Parent category with ID "${data.parentId}" does not exist.`)
        }
      }

      // Create the category if all validations pass
      const category = await prisma.category.create({
        data: {
          name: data.name, // Normalize name
          parentId: data.parentId || null,
        },
      })

      return category
    } catch (error: any) {
      console.error('Error creating category:', error.message)

      // Re-throw the error to be handled by the controller
      throw new HttpException(
        error.statusCode || 500,
        error.message || 'An unexpected error occurred while creating the category.',
      )
    }
  },

  // Update an existing category
  updateCategory: async (id: string, data: { name: string; parentId?: string }) => {
    if (!id) {
      throw new HttpException(400, 'Category ID is required for update.')
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      throw new HttpException(422, 'Name is required and must be a valid string.')
    }

    // If parentId is provided, validate it exists
    if (data.parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: data.parentId },
      })

      if (!parentExists) {
        throw new HttpException(422, `Parent category with ID "${data.parentId}" does not exist.`)
      }
    }

    // Update the category
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name.trim().toLowerCase(),
        parentId: data.parentId || null,
      },
    })
  },

  // Delete a category
  deleteCategory: async (id: string) => {
    if (!id) {
      throw new HttpException(400, 'Category ID is required for deletion.')
    }

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new HttpException(404, `Category with ID "${id}" not found.`)
    }

    return await prisma.category.delete({
      where: { id },
    })
  },

  // Get articles for a category and its subcategories
  getArticlesByCategory: async (categoryId: string) => {
    if (!categoryId) {
      throw new HttpException(400, 'Category ID is required to fetch articles.')
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new HttpException(404, `Category with ID "${categoryId}" not found.`)
    }

    const categoryIds = await prisma.category.findMany({
      where: { OR: [{ id: categoryId }, { parentId: categoryId }] },
      select: { id: true },
    })

    const ids = categoryIds.map((c) => c.id)

    return await prisma.article.findMany({
      where: {
        categoryId: { in: ids },
      },
    })
  },
}
