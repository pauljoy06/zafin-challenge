import { useQuery } from '@tanstack/react-query'
import { fetchProductReviews, type Review } from '../api/reviews'

export function useProductReviews(productId: string | undefined) {
  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: () => {
      if (!productId) {
        throw new Error('Product id is required')
      }

      return fetchProductReviews(productId)
    },
    enabled: Boolean(productId),
  })
}
