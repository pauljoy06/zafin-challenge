import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchChildProducts, fetchRootProducts, type Product } from '../../api/products'
import { TreeTable } from '..'
import type { TreeTableColumn } from '../TreeTable/TreeTable'
import './ProductTree.css'

type ProductChildrenResult = {
  data?: Product[]
  isLoading: boolean
  isFetched: boolean
  isError?: boolean
  error?: unknown
}

const columns: TreeTableColumn<Product>[] = [
  { header: 'Product ID', cell: (item: Product) => item.productId },
  { header: 'Name', cell: (item: Product) => item.name },
]

function useProductChildren(product: Product, expanded: boolean): ProductChildrenResult {
  const query = useQuery<Product[]>({
    queryKey: ['products', 'children', product.productId],
    queryFn: () => fetchChildProducts(product.productId),
    enabled: expanded,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    isError: query.isError,
    error: query.error,
  }
}

function ProductTree() {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products', 'root'],
    queryFn: fetchRootProducts,
  })

  const navigate = useNavigate()

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
    <TreeTable
      columns={columns}
      data={data}
      getId={(product) => product.productId}
      useChildren={useProductChildren}
      onRowClick={(product) => {
        void navigate(`/products/${product.productId}`)
      }}
      messages={{
        loadingChildren: 'Loading child products…',
        emptyChildren: 'No child products found.',
        errorChildren: () => 'Failed to load child products.',
      }}
    />
  )
}

export default ProductTree
