import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { fetchProductDetail, type ProductDetail } from '../api/products'
import { formatCurrency } from '../utils'
import { Button } from '../components'
import './ProductDetail.css'

function NotFound() {
  return (
    <div className="detail-banner">
      <h2>Product not found</h2>
      <p>We couldn't find details for this product. It may have been removed or isn't available yet.</p>
    </div>
  )
}

function ProductDetail() {
  const { productId } = useParams()

  const { data, isLoading, isError, error } = useQuery<ProductDetail | null>({
    queryKey: ['product-detail', productId],
    queryFn: () => {
      if (!productId) {
        return Promise.resolve(null)
      }

      return fetchProductDetail(productId)
    },
    enabled: Boolean(productId),
  })

  const title = useMemo(() => data?.name ?? productId ?? 'Product', [data?.name, productId])

  if (isLoading) {
    return (
      <div className="detail-banner">
        <p>Loading product detail…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="detail-banner">
        <h2>Unable to load product detail</h2>
        <p>{String(error)}</p>
      </div>
    )
  }

  if (!data) {
    return <NotFound />
  }

  return (
    <article className="product-detail">
      <header className="detail-header">
        <div>
          <h1>{title}</h1>
          <p className="detail-meta">
            <span className="detail-price">{formatCurrency(data.price)}</span>
            <span>Last updated on {data.lastUpdated}</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" disabled>
          Reviews (coming soon)
        </Button>
      </header>

      <section className="detail-body">
        <div className="detail-overview">
          <ReactMarkdown>{data.overview}</ReactMarkdown>
        </div>

        <aside className="detail-sidebar">
          <h2>Categories</h2>
          <ul>
            {data.categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </aside>
      </section>
    </article>
  )
}

export default ProductDetail
