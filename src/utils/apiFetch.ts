const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000'

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch<T>(path: string, init?: FetchOptions): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...getAuthHeaders(),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const data = (await response.json()) as T
  return data
}
