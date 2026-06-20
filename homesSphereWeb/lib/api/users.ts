import { apiFetch } from './client'

export type UserRole = 'USER' | 'ADMIN'

export interface User {
  user_id: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  savedProperties: string[]
  createdAt: string
  status: 'active' | 'disabled'
  phone_number: string
}

interface BackendUser {
  id?: number | string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  isActive?: boolean
  role: UserRole
}

function mapUser(raw: BackendUser): User {
  return {
    user_id: String(raw.id ?? ''),
    first_name: String(raw.firstName ?? ''),
    last_name: String(raw.lastName ?? ''),
    email: String(raw.email ?? ''),
    role: raw.role,
    savedProperties: [],
    createdAt: '',
    status: raw.isActive === false ? 'disabled' : 'active',
    phone_number: String(raw.phoneNumber ?? ''),
  }
}

export async function getUsers(isTokenEnabled?: boolean): Promise<User[]> {
  try {
    const data = await apiFetch<BackendUser[]>('/api/v1/admins/users', {}, isTokenEnabled)
    return Array.isArray(data) ? data.map(mapUser) : []
  } catch {
    return []
  }
}


export async function getUserByIdAdmin(id: string, isTokenEnabled?: boolean): Promise<User | null> {
  try {
    const data = await apiFetch<BackendUser>(`/api/v1/admins/users/${id}`, {}, isTokenEnabled)
    return mapUser(data)
  } catch {
    return null
  }
}


export async function getUserInfoByAdmin(userId: string, isTokenEnabled?: boolean): Promise<User | null> {
  try {
    const data = await apiFetch<BackendUser>(`/api/v1/admins/users/${userId}`, {}, isTokenEnabled)
    return mapUser(data)
  } catch {
    return null
  }
}

export async function getUserById(id: string, isTokenEnabled?: boolean): Promise<User | null> {
  try {
    const data = await apiFetch<BackendUser>(`/api/v1/users/${id}`, {}, isTokenEnabled)
    return mapUser(data)
  } catch {
    return null
  }
}

export async function getUserInfo(userId: string, isTokenEnabled?: boolean): Promise<User | null> {
  try {
    const data = await apiFetch<BackendUser>(`/api/v1/users/${userId}`, {}, isTokenEnabled)
    return mapUser(data)
  } catch {
    return null
  }
}

export interface UpdateUserPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string | undefined
}


export async function addAdminUser(body: UpdateUserPayload, isTokenEnabled?: boolean): Promise<User> {
  const data = await apiFetch<BackendUser>(`/api/v1/admins/users/admin`, {
    method: 'POST',
    body: JSON.stringify({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password
    }),
  }, isTokenEnabled)
  return mapUser(data)
}


export async function updateUserInfoByAdmin(userId: string, body: UpdateUserPayload, isTokenEnabled?: boolean): Promise<User> {
  const data = await apiFetch<BackendUser>(`/api/v1/admins/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
    }),
  }, isTokenEnabled)
  return mapUser(data)
}

export async function updateUserInfo(userId: string, body: UpdateUserPayload, isTokenEnabled?: boolean): Promise<User> {
  const data = await apiFetch<BackendUser>(`/api/v1/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
    }),
  }, isTokenEnabled)
  return mapUser(data)
}

export async function changePassword(payload: { token: string; password: string }, isTokenEnabled?: boolean): Promise<void> {
  await apiFetch<unknown>('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, isTokenEnabled)
}

export async function getMockCurrentUser(): Promise<User> {
  return {
    user_id: '',
    first_name: 'User',
    last_name: '',
    email: '',
    role: 'USER',
    savedProperties: [],
    createdAt: new Date().toISOString(),
    status: 'active',
    phone_number: '',
  }
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
}

export async function registerUserByAdmin(body: RegisterPayload): Promise<BackendUser> {
  return apiFetch<BackendUser>('/api/v1/admins/users', {
    method: 'POST',
    body: JSON.stringify(body),
  }, false)
}


export async function registerUser(body: RegisterPayload): Promise<BackendUser> {
  return apiFetch<BackendUser>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(body),
  }, false)
}


export async function deactivateUser(userId: string, isTokenEnabled?: boolean): Promise<void> {
  await apiFetch<void>(`/api/v1/users/${userId}/deactivate`, { method: 'PATCH' }, isTokenEnabled)
}

export async function deleteUser(userId: string, isTokenEnabled?: boolean): Promise<void> {
  await apiFetch<void>(`/api/v1/admins/users/${userId}`, { method: 'DELETE' }, isTokenEnabled)
}
