import { apiFetch, apiUpload } from './client'

export type PropertyStatus = 'approved' | 'pending' | 'rejected'
export type HouseType = 'apartment' | 'house' | 'single-room' | 'townhouse'

export interface PropertyImage {
  imageId: string
  imageUrl: string
  primaryImage: boolean
}

export interface Property {
  id: string
  title: string
  descriptionHtml: string
  houseType: HouseType
  listingFor: 'SALE' | 'RENT' | null
  price: number
  address: { street: string; city: string; state: string; zip: string }
  bedrooms: number
  bathrooms: number
  squareFootage: number | null
  images: PropertyImage[]
  status: PropertyStatus
  availableFrom: string
  ownerId: string
  ownerContact: string
  listedDate: string
  viewCount: number
  listingAgentName: string | null
  listingAgentPhone: string | null
}

export interface PropertyFilters {
  search?: string
  listingFor?: string
  type?: string          // URL alias: "buy" → SALE, "rent" → RENT
  houseType?: string
  status?: string
  bedrooms?: string
  bathrooms?: string
  city?: string
  page?: string
  size?: string
  sortBy?: string
  sortDirection?: string
}

interface BackendPage {
  // Spring Boot Page<T> field names (most common)
  content?: BackendProperty[]
  totalElements?: number
  totalPages?: number
  number?: number
  // Alternative field names some backends use
  data?: BackendProperty[]
  items?: BackendProperty[]
  results?: BackendProperty[]
  total?: number
  count?: number
  pages?: number
  page?: number
  currentPage?: number
}

function extractRaw(res: BackendProperty[] | BackendPage): {
  items: BackendProperty[]
  totalPages: number
  totalElements: number
  currentPage: number
} {
  if (Array.isArray(res)) {
    return { items: res, totalPages: 1, totalElements: res.length, currentPage: 0 }
  }
  const items = (res.content ?? res.data ?? res.items ?? res.results ?? []) as BackendProperty[]
  return {
    items,
    totalPages: Number(res.totalPages ?? res.pages ?? 1),
    totalElements: Number(res.totalElements ?? res.total ?? res.count ?? items.length),
    currentPage: Number(res.number ?? res.page ?? res.currentPage ?? 0),
  }
}

interface BackendProperty {
  id?: number | string
  title?: string
  descriptionHtml?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  houseType?: string
  status?: string
  address?: { street?: string; city?: string; state?: string; zipCode?: string; zip?: string }
  images?: Array<{ imageId?: string; imageUrl?: string; primaryImage?: boolean }>
  availableFrom?: string
  ownerId?: number | string
  ownerContact?: string
  listedDate?: string
  createdAt?: string
  viewCount?: number
  views?: number
  listingFor?: string | null
  squareFootage?: number | null
  listingAgentName?: string | null
  listingAgentPhone?: string | null
}

const HOUSE_TYPE_MAP: Record<string, HouseType> = {
  APARTMENT: 'apartment',
  apartment: 'apartment',
  HOUSE: 'house',
  house: 'house',
  SINGLE_ROOM: 'single-room',
  'single-room': 'single-room',
  TOWNHOUSE: 'townhouse',
  townhouse: 'townhouse',
}

const STATUS_MAP: Record<string, PropertyStatus> = {
  APPROVED: 'approved',
  approved: 'approved',
  PENDING: 'pending',
  pending: 'pending',
  REJECTED: 'rejected',
  rejected: 'rejected',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

function toAbsoluteUrl(url: string): string {
  if (!url || url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_API_URL ?? ''}${url}`
}

function mapProperty(raw: BackendProperty): Property {
  const addr = raw.address ?? {}
  const desc = String(raw.descriptionHtml ?? '')
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? (stripHtml(desc).slice(0, 60) || 'Untitled')),
    descriptionHtml: desc,
    houseType: HOUSE_TYPE_MAP[raw.houseType ?? ''] ?? 'apartment',
    price: Number(raw.price ?? 0),
    address: {
      street: String(addr.street ?? ''),
      city: String(addr.city ?? ''),
      state: String(addr.state ?? ''),
      zip: String(addr.zipCode ?? addr.zip ?? ''),
    },
    bedrooms: Number(raw.bedrooms ?? 0),
    bathrooms: Number(raw.bathrooms ?? 0),
    squareFootage: raw.squareFootage ?? null,
    images: Array.isArray(raw.images)
      ? raw.images.map((img) => ({
        imageId: String(img.imageId ?? ''),
        imageUrl: toAbsoluteUrl(String(img.imageUrl ?? '')),
        primaryImage: Boolean(img.primaryImage),
      }))
      : [],
    status: STATUS_MAP[raw.status ?? ''] ?? 'pending',
    listingFor: (raw.listingFor === 'SALE' || raw.listingFor === 'RENT') ? raw.listingFor : null,
    availableFrom: String(raw.availableFrom ?? ''),
    ownerId: String(raw.ownerId ?? ''),
    ownerContact: String(raw.ownerContact ?? ''),
    listedDate: String(raw.listedDate ?? raw.createdAt ?? ''),
    viewCount: Number(raw.viewCount ?? raw.views ?? 0),
    listingAgentName: raw.listingAgentName ?? null,
    listingAgentPhone: raw.listingAgentPhone ?? null,
  }
}

function toBackendHouseType(type: string): string {
  const map: Record<string, string> = {
    apartment: 'APARTMENT',
    house: 'HOUSE',
    'single-room': 'SINGLE_ROOM',
    townhouse: 'TOWNHOUSE',
  }
  return map[type] ?? type.toUpperCase()
}

export async function getProperties(filters: PropertyFilters = {}, isTokenEnabled?: boolean): Promise<Property[]> {
  try {
    const TYPE_MAP: Record<string, string> = { buy: 'SALE', rent: 'RENT' }
    const listingFor = filters.listingFor ?? (filters.type ? TYPE_MAP[filters.type.toLowerCase()] : undefined)

    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.houseType) params.set('houseType', filters.houseType)
    if (filters.status) params.set('status', filters.status)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms)
    if (filters.city) params.set('city', filters.city)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortDirection) params.set('sortDirection', filters.sortDirection)
    if (filters.page) params.set('page', filters.page)
    if (filters.size) params.set('size', filters.size)

    const query = params.toString()
    const url = `/api/v1/properties${query ? `?${query}` : ''}`
    const res = await apiFetch<BackendProperty[] | BackendPage>(url, {}, isTokenEnabled)
    const { items: raw } = extractRaw(res)
    return raw
      .map(mapProperty)
      .filter((p) => !listingFor || p.listingFor === listingFor)
  } catch {
    return []
  }
}

export interface PropertyPage {
  items: Property[]
  totalPages: number
  totalElements: number
  currentPage: number
}


export async function getPropertiesPagedAdmin(
  filters: PropertyFilters = {},
  isTokenEnabled?: boolean,
): Promise<PropertyPage> {
  try {
    const TYPE_MAP: Record<string, string> = { buy: 'SALE', rent: 'RENT' }
    const listingFor = filters.listingFor ?? (filters.type ? TYPE_MAP[filters.type.toLowerCase()] : undefined)

    const params = new URLSearchParams()
    params.set('page', filters.page ?? '0')
    params.set('size', filters.size ?? '12')
    if (filters.search) params.set('search', filters.search)
    if (filters.houseType) params.set('houseType', filters.houseType)
    if (filters.status) params.set('status', filters.status)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms)
    if (filters.city) params.set('city', filters.city)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortDirection) params.set('sortDirection', filters.sortDirection)

    const res = await apiFetch<BackendProperty[] | BackendPage>(
      `/api/v1/admins/properties?${params.toString()}`,
      {},
      isTokenEnabled,
    )

    const { items: rawItems, totalPages, totalElements, currentPage } = extractRaw(res)

    const items = rawItems
      .map(mapProperty)
      .filter((p) => !listingFor || p.listingFor === listingFor)

    return { items, totalPages, totalElements, currentPage }
  } catch {
    return { items: [], totalPages: 0, totalElements: 0, currentPage: 0 }
  }
}

export async function getPropertiesPaged(
  filters: PropertyFilters = {},
  isTokenEnabled?: boolean,
): Promise<PropertyPage> {
  try {
    const TYPE_MAP: Record<string, string> = { buy: 'SALE', rent: 'RENT' }
    const listingFor = filters.listingFor ?? (filters.type ? TYPE_MAP[filters.type.toLowerCase()] : undefined)

    const params = new URLSearchParams()
    params.set('page', filters.page ?? '0')
    params.set('size', filters.size ?? '12')
    if (filters.search) params.set('search', filters.search)
    if (filters.houseType) params.set('houseType', filters.houseType)
    if (filters.status) params.set('status', filters.status)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms)
    if (filters.city) params.set('city', filters.city)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortDirection) params.set('sortDirection', filters.sortDirection)

    const res = await apiFetch<BackendProperty[] | BackendPage>(
      `/api/v1/search?${params.toString()}`,
      {},
      isTokenEnabled,
    )

    const { items: rawItems, totalPages, totalElements, currentPage } = extractRaw(res)

    const items = rawItems
      .map(mapProperty)
      .filter((p) => !listingFor || p.listingFor === listingFor)

    return { items, totalPages, totalElements, currentPage }
  } catch {
    return { items: [], totalPages: 0, totalElements: 0, currentPage: 0 }
  }
}

export async function getPropertyById(id: string, isTokenEnabled?: boolean): Promise<Property | null> {
  try {
    const data = await apiFetch<BackendProperty>(`/api/v1/search/${id}`, {}, isTokenEnabled)
    return mapProperty(data)
  } catch {
    return null
  }
}

export async function getPropertyByIdAdmin(id: string, isTokenEnabled?: boolean): Promise<Property | null> {
  try {
    const data = await apiFetch<BackendProperty>(`/api/v1/admins/properties/${id}`, {}, isTokenEnabled)
    return mapProperty(data)
  } catch {
    return null
  }
}

export async function getAllProperties(isTokenEnabled?: boolean): Promise<Property[]> {
  try {
    const res = await apiFetch<BackendProperty[] | BackendPage>('/api/v1/properties', {}, isTokenEnabled)
    const { items } = extractRaw(res)
    return items.map(mapProperty)
  } catch {
    return []
  }
}

export async function getFeaturedProperties(isTokenEnabled?: boolean): Promise<Property[]> {
  try {
    return await getProperties({ size: '6' }, isTokenEnabled)
  } catch {
    return []
  }
}

export async function getPropertiesByUser(userId: string, isTokenEnabled?: boolean): Promise<Property[]> {
  try {
    const res = await apiFetch<BackendProperty[] | BackendPage>(`/api/v1/users/${userId}/properties`, {}, isTokenEnabled)
    const { items } = extractRaw(res)
    return items.map(mapProperty)
  } catch {
    return []
  }
}

export async function getPendingProperties(isTokenEnabled?: boolean): Promise<Property[]> {
  try {
    const res = await apiFetch<BackendProperty[] | BackendPage>('/api/v1/admins/properties/pending', {}, isTokenEnabled)
    const { items } = extractRaw(res)
    return items.map(mapProperty)
  } catch {
    return []
  }
}

export interface PropertyPayload {
  descriptionHtml: string
  houseType: string
  listingFor: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFootage?: number | null
  street: string
  city: string
  state: string
  zip: string
  listingAgentName?: string | null
  listingAgentPhone?: string | null
}

function toBackendBody(body: PropertyPayload) {
  return {
    descriptionHtml: body.descriptionHtml,
    price: body.price,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    houseType: toBackendHouseType(body.houseType),
    listingFor: body.listingFor,
    squareFootage: body.squareFootage ?? null,
    listingAgentName: body.listingAgentName ?? null,
    listingAgentPhone: body.listingAgentPhone ?? null,
    address: {
      street: body.street,
      city: body.city,
      state: body.state,
      zipCode: body.zip,
    },
  }
}

export async function createProperty(userId: string, body: PropertyPayload, isTokenEnabled?: boolean): Promise<Property> {
  const data = await apiFetch<BackendProperty>(`/api/v1/users/${userId}/properties`, {
    method: 'POST',
    body: JSON.stringify(toBackendBody(body)),
  }, isTokenEnabled)
  return mapProperty(data)
}

export async function updateProperty(propertyId: string, body: PropertyPayload, isTokenEnabled?: boolean): Promise<Property> {
  const data = await apiFetch<BackendProperty>(`/api/v1/properties/${propertyId}`, {
    method: 'PUT',
    body: JSON.stringify(toBackendBody(body)),
  }, isTokenEnabled)
  return mapProperty(data)
}

export async function deleteProperty(propertyId: string, isTokenEnabled?: boolean): Promise<void> {
  await apiFetch<void>(`/api/v1/properties/${propertyId}`, { method: 'DELETE' }, isTokenEnabled)
}

export async function uploadPropertyImages(propertyId: string, files: File[]): Promise<void> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  await apiUpload<unknown>(`/api/v1/properties/${propertyId}/images`, formData,true)
}

export async function deletePropertyImage(propertyId: string, imageId: string, isTokenEnabled?: boolean): Promise<void> {
  await apiFetch<void>(`/api/v1/properties/${propertyId}/images/${imageId}`, { method: 'DELETE' }, isTokenEnabled)
}


export type StatusChangeValue = 'PENDING' | 'APPROVED' | 'REJECTED'

export async function propertyStatusChange(
  propertyId: string,
  status: StatusChangeValue,
  reason?: string,
  isTokenEnabled?: boolean,
): Promise<void> {
  await apiFetch<void>(`/api/v1/admins/properties/${propertyId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(reason ? { reason } : {}) }),
  }, isTokenEnabled)
}