import { apiFetch } from '../utils/apiFetch'

export type Product = {
  productId: string
  parentProductId: string | null
  name: string
  availableFrom: string
}

export type ProductDetail = {
  productId: string
  name: string
  overview: string
  price: number
  categories: string[]
  lastUpdated: string
}

export async function fetchRootProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products?parentProductId=null')
}

export async function fetchChildProducts(parentProductId: string): Promise<Product[]> {
  const query = new URLSearchParams({ parentProductId }).toString()

  const response = await apiFetch<Product[]>(`/products?${query}`)

  return response.filter((product) => product.parentProductId === parentProductId)
}

export async function fetchProductDetail(productId: string): Promise<ProductDetail | null> {
  const query = new URLSearchParams({ productId }).toString()
  const response = await apiFetch<ProductDetail[]>(`/productDetails?${query}`)

  if (response.length === 0) {
    return null
  }

  return response[0]
}
