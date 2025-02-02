export interface Article {
  id: string
  title: string
  description: string
  categoryId: string
  authorId: string
  rating: number
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateArticleInput {
  title: string
  description: string
  categoryId: string
  authorId: string
  rating: number
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}

export interface ArticleQueryParams {
  page?: number
  limit?: number
  category?: string
  isFavorite?: boolean
  minRating?: number
}
