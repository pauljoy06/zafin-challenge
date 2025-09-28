import { apiFetch } from '../utils/apiFetch'

export type Product = {
  productId: string
  parentProductId: string | null
  name: string
  availableFrom: string
}

export async function fetchRootProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products?parentProductId=null')
}

export async function fetchChildProducts(parentProductId: string): Promise<Product[]> {
  const query = new URLSearchParams({ parentProductId }).toString()

  const response = await apiFetch<Product[]>(`/products?${query}`)

  return response.filter((product) => product.parentProductId === parentProductId)
}
