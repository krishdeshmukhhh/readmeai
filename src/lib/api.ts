const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `HTTP ${res.status}`) as Error & { status: number; code?: string }
    err.status = res.status
    err.code = body.error
    throw err
  }

  return res.json()
}

export const api = {
  syncUser: (clerkId: string, email: string) =>
    request<{ user: { plan: string; generationCount: number } }>(
      '/api/user/sync',
      { method: 'POST', body: JSON.stringify({ clerkId, email }) },
    ),

  getUser: (clerkId: string, token: string) =>
    request<{ plan: string; generationCount: number }>(
      `/api/user/${clerkId}`,
      {},
      token,
    ),

  generate: (
    payload: {
      clerkId: string
      projectName: string
      description: string
      techStack: string
      templateType: string
      githubUrl?: string
    },
    token: string,
  ) =>
    request<{ readme: string }>(
      '/api/generate',
      { method: 'POST', body: JSON.stringify(payload) },
      token,
    ),

  createCheckoutSession: (clerkId: string, email: string, token: string) =>
    request<{ url: string }>(
      '/api/create-checkout-session',
      { method: 'POST', body: JSON.stringify({ clerkId, email }) },
      token,
    ),
}
