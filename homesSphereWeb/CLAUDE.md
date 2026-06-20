# HomeSphere — claude.md
> This file provides context for AI-assisted development on the HomeSphere frontend project.
> Keep it updated as the project evolves.

---

## Project Identity

**Product Name:** HomeSphere  
**Framework:** Next.js 14 (App Router)  
**Language:** TypeScript  
**Type:** Residential rental listing platform (frontend only)  
**Audience:** Three user roles — Customers (tenants), Property Owners, Administrators  
**Scope:** Frontend UI only. All data interactions use mocked JSON fixtures until backend is ready.

---

## Core User Roles & Permissions

| Role | Can Do |
|---|---|
| **Customer** | Browse/search listings, view property details, register/login, save favorites, send inquiries, request appointments |
| **Property Owner** | Register/login, create/edit/delete listings, upload images, mark availability, view received inquiries |
| **Administrator** | Approve/reject pending listings, manage user accounts, view platform stats and reports |

---

## Design Philosophy

HomeSphere should feel **trustworthy, clean, and approachable** — not a generic SaaS template. The platform deals with homes, which are personal. The visual language should reflect warmth and reliability.

### Design Tokens

Define these in `tailwind.config.ts` and mirror as CSS variables in `app/globals.css`:

```css
/* app/globals.css */
:root {
  --color-primary:   #1E6B5E;  /* Deep teal — trust, calm */
  --color-accent:    #F4A535;  /* Warm amber — energy, listings CTA */
  --color-surface:   #F8F6F1;  /* Warm off-white — paper feel, not sterile */
  --color-text:      #1A1A1A;  /* Near-black body text */
  --color-muted:     #6B7280;  /* Secondary/helper text */
  --color-border:    #E5E2DB;  /* Subtle warm border */
  --color-success:   #22C55E;
  --color-warning:   #F59E0B;
  --color-error:     #EF4444;
  --color-pending:   #F4A535;
  --color-active:    #1E6B5E;
  --color-rejected:  #EF4444;
}
```

```ts
// tailwind.config.ts — extend theme.colors
colors: {
  primary:  '#1E6B5E',
  accent:   '#F4A535',
  surface:  '#F8F6F1',
  'hs-text': '#1A1A1A',
  muted:    '#6B7280',
  border:   '#E5E2DB',
}
```

### Typography — loaded via `next/font`

```ts
// app/layout.tsx
import { Fraunces, Inter } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
```

- **Display** (`--font-display`): Fraunces — used only for page headlines and hero text
- **Body** (`--font-body`): Inter — all UI text, labels, buttons
- **Mono**: JetBrains Mono (CDN or next/font) — price display, stats, form field hints

### Signature Element
Property cards on the search page use a subtle **teal left-border accent** (`border-l-4 border-primary`) that transitions to full background tint on hover — a quiet, distinctive touch that gives the grid personality without being loud.

---

## Next.js App Router Conventions

### Server vs Client Components
- **Default to Server Components.** Every `page.tsx` and layout should be a Server Component unless it needs interactivity.
- Add `'use client'` only when the component uses: `useState`, `useEffect`, event handlers, browser APIs, or Zustand.
- Interactive islands (filters, forms, modals, carousels) are Client Components imported into Server Component pages.

```tsx
// ✅ Server Component page — data fetched server-side
// app/search/page.tsx
import { getProperties } from '@/lib/api/properties'
import FilterBar from '@/components/filters/FilterBar'       // 'use client'
import PropertyGrid from '@/components/property/PropertyGrid' // Server Component

export default async function SearchPage({ searchParams }) {
  const properties = await getProperties(searchParams)
  return (
    <main>
      <FilterBar />
      <PropertyGrid properties={properties} />
    </main>
  )
}
```

### Routing — App Router file conventions

| File | Purpose |
|---|---|
| `page.tsx` | Publicly accessible route segment |
| `layout.tsx` | Shared UI wrapper (persists across child routes) |
| `loading.tsx` | Automatic Suspense wrapper — shown while page loads |
| `error.tsx` | Error boundary for the segment (`'use client'` required) |
| `not-found.tsx` | 404 UI for the segment |
| `middleware.ts` | Runs before every request — used for auth route guards |

### Route Groups (no URL impact)
- `(auth)` — login, register, forgot-password — minimal centered layout
- `(customer)` — profile, favorites, inquiries, appointments — customer sidebar
- `(owner)` — dashboard, listings, inquiries — owner sidebar
- `(admin)` — dashboard, moderation, users, reports — admin sidebar

### Dynamic Routes
- `app/property/[id]/page.tsx` — property detail
- `app/(owner)/listings/[id]/edit/page.tsx` — edit listing
- `app/(admin)/moderation/[id]/page.tsx` — listing review
- `app/messages/[threadId]/page.tsx` — message thread

### URL Search Params for Filters
Filter state is stored in URL search params, not component state. This enables shareable filtered URLs and server-side filtering.

```tsx
// Reading filters server-side
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { category?: string; city?: string; minPrice?: string; maxPrice?: string }
}) {
  const properties = await getProperties(searchParams)
  ...
}
```

```tsx
// Updating filters client-side (FilterBar.tsx — 'use client')
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const router = useRouter()
const pathname = usePathname()
const searchParams = useSearchParams()

function applyFilters(filters) {
  const params = new URLSearchParams(searchParams)
  Object.entries(filters).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k))
  router.push(`${pathname}?${params.toString()}`)
}
```

### `next/image` for All Images
Never use raw `<img>` tags. Always use `next/image`:

```tsx
import Image from 'next/image'
<Image src={property.images[0]} alt={property.title} width={400} height={280} className="rounded-lg object-cover" />
```

### `next/link` for All Internal Navigation
Never use `<a href>` for internal links. Always use `next/link`:

```tsx
import Link from 'next/link'
<Link href={`/property/${property.id}`}>View Property</Link>
```

---

## File & Naming Conventions

### Files
- Components: `PascalCase` — `PropertyCard.tsx`, `FilterBar.tsx`
- Hooks: `camelCase` with `use` prefix — `usePropertyFilters.ts`
- Utilities: `camelCase` — `formatPrice.ts`, `cn.ts`
- Zod schemas: `camelCase` with `Schema` suffix — `listingSchema.ts`
- All files: `.tsx` for JSX, `.ts` for pure logic

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["./components/*"],
      "@/lib/*":        ["./lib/*"],
      "@/hooks/*":      ["./hooks/*"],
      "@/store/*":      ["./store/*"],
      "@/data/*":       ["./lib/data/*"]
    }
  }
}
```

---

## Full Folder Structure

```
homesphere/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── profile/page.tsx
│   │   ├── favorites/page.tsx
│   │   ├── inquiries/page.tsx
│   │   └── appointments/page.tsx
│   ├── (owner)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── listings/page.tsx
│   │   ├── listings/new/page.tsx
│   │   ├── listings/[id]/edit/page.tsx
│   │   └── inquiries/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── moderation/page.tsx
│   │   ├── moderation/[id]/page.tsx
│   │   ├── users/page.tsx
│   │   └── reports/page.tsx
│   ├── property/[id]/page.tsx
│   ├── search/page.tsx
│   ├── messages/
│   │   ├── page.tsx
│   │   └── [threadId]/page.tsx
│   ├── notifications/page.tsx
│   ├── layout.tsx            # Root layout — fonts, providers
│   ├── page.tsx              # Landing page
│   ├── not-found.tsx
│   ├── error.tsx
│   └── loading.tsx
├── components/
│   ├── ui/                   # Button, Input, Badge, Modal, Toast, Skeleton...
│   ├── property/             # PropertyCard, PropertyGallery, PropertyDetail...
│   ├── filters/              # FilterBar, PriceSlider, CategorySelect...
│   ├── forms/                # ListingForm, InquiryForm, AppointmentForm...
│   └── layout/               # Navbar, Footer, Sidebar, AdminSidebar...
├── lib/
│   ├── data/                 # Mock JSON fixtures (properties.json, users.json...)
│   ├── api/                  # Async mock fetch functions — replace with real API
│   │   ├── properties.ts
│   │   ├── users.ts
│   │   └── inquiries.ts
│   ├── validations/          # Zod schemas (listingSchema.ts, inquirySchema.ts...)
│   └── utils.ts              # cn(), formatPrice(), formatDate()...
├── hooks/                    # Client-side custom hooks
├── store/                    # Zustand stores
├── middleware.ts              # Auth route protection
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Key Business Rules (Frontend Validation)

Enforce in UI — do not rely on backend alone:

1. **Listing submission** — Title, Price, Address, and Category are required. Form cannot submit without all four.
2. **Price field** — Must be a positive number. No negative values, no text. Use `z.number().positive()` in Zod schema.
3. **Room count fields** — Numeric only, minimum value of 0.
4. **New listings** — Always submit with `status: "pending"`. Never allow `"active"` to be set from the owner form.
5. **Admin approval gate** — The "Approve" button on `/admin/moderation/[id]` is only enabled after the page has been fully rendered (i.e. the admin is on the detail page, not the queue). Track via a `reviewedListingId` cookie or URL param set on page load.
6. **Admin rejection** — A reason must be selected or provided before the reject confirmation goes through.
7. **Filters reset** — A single "Reset Filters" click navigates to `/search` with no params.
8. **Empty search state** — If `properties.length === 0`, render the `<EmptyState>` component with a "Reset Filters" link.

---

## Status System

Listings use a three-state status system:

| Status | Tailwind color | CSS variable | Visible in public search? |
|---|---|---|---|
| `pending` | `text-amber-500 bg-amber-50` | `--color-pending` | No |
| `active` | `text-primary bg-teal-50` | `--color-active` | Yes |
| `rejected` | `text-red-500 bg-red-50` | `--color-error` | No |

Always render via `<Badge status={listing.status} />` — never inline conditional color logic in page components.

---

## Mock Data Shape

Fixtures live in `lib/data/`. Async wrapper functions in `lib/api/` simulate latency with `await new Promise(r => setTimeout(r, 200))`.

### Property Listing (`lib/data/properties.json`)
```json
{
  "id": "prop_001",
  "title": "Sunny 2-Bedroom Apartment in Midtown",
  "description": "Bright, spacious apartment with city views...",
  "category": "apartment",
  "price": 1200,
  "currency": "USD",
  "address": {
    "street": "42 Maple Ave",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  },
  "bedrooms": 2,
  "bathrooms": 1,
  "images": ["/mock/property-1a.jpg", "/mock/property-1b.jpg"],
  "status": "active",
  "availableFrom": "2025-08-01",
  "ownerId": "owner_003",
  "ownerContact": "jane@example.com",
  "createdAt": "2025-07-15T10:00:00Z",
  "views": 142
}
```

### User (`lib/data/users.json`)
```json
{
  "id": "user_001",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "customer",
  "savedProperties": ["prop_001", "prop_007"],
  "createdAt": "2025-06-01T08:00:00Z"
}
```

### Inquiry (`lib/data/inquiries.json`)
```json
{
  "id": "inq_001",
  "propertyId": "prop_001",
  "customerId": "user_001",
  "message": "Hi, is this available for September?",
  "type": "inquiry",
  "status": "pending",
  "createdAt": "2025-07-20T14:00:00Z"
}
```

---

## State Management (Zustand — Client Only)

Zustand stores are used for **client-side ephemeral state only**. Server-fetched data stays in Server Components and is passed as props.

```ts
// store/useAuthStore.ts — 'use client' consumers only
interface AuthStore {
  user: User | null
  role: 'customer' | 'owner' | 'admin' | null
  login: (user: User) => void
  logout: () => void
}
```

Stores:
- `useAuthStore` — current user, role (synced from cookie on mount)
- `useFilterStore` — transient filter UI state before URL commit
- `useNotificationStore` — toast queue, unread notification count
- `useAdminStore` — which listing the admin is currently reviewing

---

## Route Protection (middleware.ts)

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_ROUTES: Record<string, string[]> = {
  customer: ['/profile', '/favorites', '/inquiries', '/appointments'],
  owner:    ['/owner'],
  admin:    ['/admin'],
}

export function middleware(request: NextRequest) {
  const role = request.cookies.get('hs_role')?.value
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && role !== null) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (path.startsWith('/owner') && role !== null) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // customer routes guard omitted for brevity
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*', '/profile', '/favorites'],
}
```

---

## AI Assistance Notes

When generating code for this project:

1. **App Router first** — use `page.tsx` / `layout.tsx` / `loading.tsx` conventions. Never suggest `pages/` directory patterns.
2. **Server Components by default** — add `'use client'` only when genuinely needed.
3. **Use `next/image`** for all images, **`next/link`** for all internal links.
4. **Filters via URL search params** — not `useState`. Use `useRouter` + `useSearchParams` in Client Components to update the URL.
5. **Use design tokens** — no hardcoded hex values. Reference Tailwind config classes or CSS variables.
6. **Validate with Zod** — every form has a schema in `lib/validations/`. Use React Hook Form's `zodResolver`.
7. **Empty states are required** — never return a page with an empty container. Use `<EmptyState>` component.
8. **Status badges via `<Badge>`** — never inline conditional color logic in page components.
9. **Mock data from `lib/data/`** — never fetch from a real API URL.
10. **Mobile-first** — build responsive from 375px up using Tailwind's `sm:`, `md:`, `lg:` prefixes.
11. **Respect `prefers-reduced-motion`** — use Tailwind's `motion-safe:` variant for all transitions.

---

## What NOT to Build (Frontend Scope Boundaries)

- No real authentication — mock auth via cookie (`hs_role`) read by `middleware.ts`
- No real file storage — image upload shows preview only via `FileReader` API
- No real payment processing
- No real-time websockets — static mock data only
- No Next.js API Routes (`app/api/`) — the backend team owns the API layer
- No email sending — UI flow only (inquiry submitted → success toast shown)
- No `pages/` directory — App Router only

---

## Glossary

| Term | Meaning |
|---|---|
| Listing | A property posted by an owner |
| Inquiry | A message sent by a customer about a property |
| Appointment | A visit request submitted by a customer |
| Moderation Queue | Admin view of all `pending` listings awaiting review |
| Active | A listing approved by admin and visible in public search |
| Pending | A listing submitted by owner but not yet reviewed |
| Rejected | A listing declined by admin with a reason |
| Route Group | A `(folder)` in the App Router that groups routes under a shared layout without affecting the URL |
| Server Component | Default Next.js component — runs on server, no interactivity |
| Client Component | Component marked `'use client'` — runs in browser, can use hooks and events |