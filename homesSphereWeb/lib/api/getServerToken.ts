import { cookies } from 'next/headers'

export async function getServerToken(): Promise<string | undefined> {
  const jar = await cookies()
  return jar.get('hs_token')?.value
}

export async function getServerUserId(): Promise<string | undefined> {
  const jar = await cookies()
  return jar.get('hs_user_id')?.value
}
