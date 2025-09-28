import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { fetchChildProducts, fetchRootProducts, type Product } from '../../api/products'
import './ProductTree.css'

type ProductTreeRowProps = {
  product: Product
  depth: number
}

function ProductTreeRow({ product, depth }: ProductTreeRowProps) {
  const [expanded, setExpanded] = useState(false)

  const {
    data: children = [],
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['products', 'children', product.productId],
    queryFn: () => fetchChildProducts(product.productId),
    enabled: expanded,
  })

  const showToggle = useMemo(() => {
    if (expanded) {
      return true
    }

    if (!isFetched) {
      return true
    }

    return children.length > 0
  }, [children.length, expanded, isFetched])

  const indentRem = (depth * 1.6).toString()

  const handleToggle = () => {
    if (!showToggle) {
      return
    }

    setExpanded((prev) => !prev)
  }

  return (
    <>
      <tr>
        <td className="id">
          <span style={{ marginLeft: `${indentRem}rem` }}>
            {showToggle ? (
              <button type="button" className="toggle" onClick={handleToggle}>
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <span className="toggle-placeholder" />
            )}
          </span>
          <span className="id-label">{product.productId}</span>
        </td>
        <td>{product.name}</td>
      </tr>

      {expanded && isLoading && (
        <tr>
          <td colSpan={2} className="state-row">
            Loading child products…
          </td>
        </tr>
      )}

      {expanded && !isLoading && children.length === 0 && (
        <tr>
          <td colSpan={2} className="state-row">
            No child products found.
          </td>
        </tr>
      )}

      {expanded &&
        children.map((child) => (
          <ProductTreeRow key={child.productId} product={child} depth={depth + 1} />
        ))}
    </>
  )
}

function ProductTree() {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products', 'root'],
    queryFn: fetchRootProducts,
  })

  if (isLoading) {
    return <div className="state-banner">Loading products…</div>
  }

  if (isError) {
    return <div className="state-banner">Failed to load products: {String(error)}</div>
  }

  if (!data || data.length === 0) {
    return <div className="state-banner">No products available yet.</div>
  }

  return (
    <table className="product-tree">
      <thead>
        <tr>
          <th scope="col">Product ID</th>
          <th scope="col">Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product) => (
          <ProductTreeRow key={product.productId} product={product} depth={0} />
        ))}
      </tbody>
    </table>
  )
}

export default ProductTree
