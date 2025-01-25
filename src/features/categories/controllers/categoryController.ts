import { Request, Response, NextFunction } from 'express'
import { CategoryService } from '../services/categoryService'

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getCategories()
    res.status(200).json(categories)
  } catch (err) {
    next(err) // Pass errors to the errorHandler
  }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const category = await CategoryService.getCategoryById(id)
    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }
    res.status(200).json(category)
  } catch (err) {
    next(err) 
  }
}


export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, parentId } = req.body
    if (!name) {
       res.status(400).json({ message: 'Name is required' })
       return
    }

    const category = await CategoryService.createCategory({ name, parentId })
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, parentId } = req.body
    const category = await CategoryService.updateCategory(id, { name, parentId })
    res.status(200).json(category)
  } catch (err) {
    next(err)
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await CategoryService.deleteCategory(id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const getArticlesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const articles = await CategoryService.getArticlesByCategory(id)
    res.status(200).json(articles)
  } catch (err) {
    next(err)
  }
}
