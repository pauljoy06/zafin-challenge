import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchChildProducts, fetchRootProducts, type Product } from '../../api/products'
import { TreeTable, StateBanner } from '..'
import type { TreeTableColumn } from '../TreeTable/TreeTable'

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
    return <StateBanner>Loading products…</StateBanner>
  }

  if (isError) {
    return <StateBanner variant="error">Failed to load products: {String(error)}</StateBanner>
  }

  if (!data || data.length === 0) {
    return <StateBanner variant="warning">No products available yet.</StateBanner>
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
