const SERVER_BASE = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_URL
  : ''

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const jar = await cookies()
      return jar.get('hs_token')?.value ?? null
    } catch {
      return null
    }
  }
  return localStorage.getItem('hs_token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isTokenEnabled?: boolean,
): Promise<T> {
  const token = isTokenEnabled ? await getToken() : null

  console.log(token + "------token")

  const reqUrl = `${SERVER_BASE}${path}`;
  console.log(reqUrl);


  const res = await fetch(reqUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function apiUpload<T>(path: string, formData: FormData,  isTokenEnabled?: boolean): Promise<T> {
  const token = isTokenEnabled ? await getToken() : null
  const res = await fetch(`${SERVER_BASE}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
