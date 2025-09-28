import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { BackButton, Markdown } from '../components'
import { useProductReviews } from '../hooks'
import { formatDate } from '../utils'
import './ProductReviews.css'

type LocationState = {
  productName?: string
}

function ProductReviews() {
  const { productId } = useParams()
  const location = useLocation()
  const state = location.state as LocationState | null

  const productName = state?.productName
  const title = useMemo(() => productName ?? productId ?? 'Product', [productName, productId])
  const fallbackPath = productId ? `/products/${productId}` : '/products'

  const { data, isLoading, isError, error } = useProductReviews(productId)

  if (!productId) {
    return (
      <article className="reviews-view">
        <div className="reviews-banner">
          <h2>Product not specified</h2>
          <p>Try reopening reviews from the product list.</p>
        </div>
      </article>
    )
  }

  if (isLoading) {
    return (
      <article className="reviews-view">
        <div className="reviews-banner">Loading reviews…</div>
      </article>
    )
  }

  if (isError) {
    return (
      <article className="reviews-view">
        <div className="reviews-banner">
          <h2>Unable to load reviews</h2>
          <p>{String(error)}</p>
        </div>
      </article>
    )
  }

  const reviews = data ?? []

  return (
    <article className="reviews-view">
      <header className="reviews-header">
        <BackButton fallbackPath={fallbackPath}>Back to product</BackButton>
        <div>
          <h1>{title} reviews</h1>
          <p className="reviews-subtitle">Customer impressions and feedback</p>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="reviews-banner">No reviews published yet.</div>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => {
            const { name, email, date } = review.reviewInfo
            const formattedDate = formatDate(date)

            return (
              <li key={review.reviewId} className="review-card">
                <header className="review-header">
                  <h2>{name}</h2>
                  <p className="review-meta">
                    <span>{formattedDate}</span>
                    <span>{email}</span>
                  </p>
                </header>
                <Markdown className="review-content">{review.reviewContent}</Markdown>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

export default ProductReviews
