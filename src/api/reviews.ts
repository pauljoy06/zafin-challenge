import { apiFetch } from '../utils'

type ReviewAuthor = {
  name: string
  email: string
  date: string
}

export type Review = {
  productId: string
  reviewId: string
  reviewInfo: ReviewAuthor
  reviewContent: string
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const query = new URLSearchParams({ productId }).toString()
  return apiFetch<Review[]>(`/reviews?${query}`)
}
