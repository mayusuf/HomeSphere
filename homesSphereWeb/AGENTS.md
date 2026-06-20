# HomeSphere — Frontend Development Agenda (Next.js)

## Project Overview
HomeSphere is a centralized residential rental platform connecting customers, property owners, and administrators. This agenda covers **frontend only** — no backend implementation. The project is built with **Next.js 14 App Router**.

---

## Phase 1: Project Setup & Design System
**Goal:** Establish the foundation before writing any feature code.

- Initialize project: `npx create-next-app@latest homesphere --typescript --tailwind --eslint --app`
- Configure Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Define global CSS variables in `app/globals.css` (color palette, typography scale, spacing)
- Set up Next.js App Router folder structure under `app/`
- Configure path aliases in `tsconfig.json` (`@/components`, `@/lib`, `@/data`, etc.)
- Create reusable base components in `components/ui/`:
  - Button (primary, secondary, ghost)
  - Input, Select, Textarea, Checkbox
  - Badge / Status chip (Active, Pending, Rejected)
  - Card (property listing card)
  - Modal / Dialog
  - Toast / Notification
  - Loader / Skeleton screen
- Configure mock data layer: JSON fixtures in `lib/data/` + server-side helper functions
- Set up Next.js Middleware for route protection (`middleware.ts`)
- Install and configure fonts via `next/font` (Fraunces + Inter)

---

## Phase 2: Public Pages — Customer-Facing
**Goal:** Build the pages an unauthenticated or logged-in customer interacts with.

### 2.1 Landing / Home Page — `app/page.tsx`
- Hero section with search bar and call-to-action
- Featured/highlighted property listings (Server Component — fetch mock data)
- Category quick-select (Apartments, Houses, Single Rooms)
- Platform value proposition section

### 2.2 Search & Browse Page — `app/search/page.tsx`
- Server Component fetches listings; filter state lives in URL search params (`?category=apartment&city=...`)
- Property listing grid with cards
- Filter sidebar / top bar:
  - Category dropdown (Apartment, House, Single Room)
  - City search input
  - Price range slider (min/max)
  - Bedrooms count selector
  - Availability toggle
- "Apply Filters" button updates URL params → triggers server re-fetch
- "Reset Filters" single-click clears all URL params
- `<Suspense>` + skeleton for loading state
- "No matching properties found" empty state

### 2.3 Property Detail Page — `app/property/[id]/page.tsx`
- Server Component with `generateStaticParams` for static generation (mock data)
- Image gallery / carousel (Client Component island)
- Property title, description
- Rental price display
- Address and location (static map placeholder)
- Bedrooms / bathrooms count
- Availability status badge
- Owner contact info section
- "Send Inquiry" CTA (Client Component — opens modal/form)
- "Request Appointment" CTA (Client Component)
- Save to Favorites button (authenticated users only — Client Component)

---

## Phase 3: Authentication Pages
**Goal:** Customer and owner registration, login, and basic auth flow.

- `app/(auth)/login/page.tsx` — Login form
- `app/(auth)/register/page.tsx` — Register form with Customer / Owner role selection
- `app/(auth)/forgot-password/page.tsx` — Forgot Password
- All auth pages use the `(auth)` route group with a minimal shared layout
- Form validation with React Hook Form + Zod
- Mock auth: store session in a cookie read by `middleware.ts` for route protection
- Post-login redirect logic based on role (customer → `/search`, owner → `/owner/dashboard`, admin → `/admin/dashboard`)

---

## Phase 4: Customer Account Pages
**Goal:** Logged-in customer profile and activity management.

- Route group: `app/(customer)/`
- `app/(customer)/profile/page.tsx` — View/edit personal info
- `app/(customer)/favorites/page.tsx` — Saved/Favorite Properties list
- `app/(customer)/inquiries/page.tsx` — List of sent inquiries and their status
- `app/(customer)/appointments/page.tsx` — Scheduled/pending appointment requests
- Shared layout: `app/(customer)/layout.tsx` — customer sidebar nav

---

## Phase 5: Property Owner Dashboard
**Goal:** Owner's management interface for listings.

- Route group: `app/(owner)/`
- `app/(owner)/dashboard/page.tsx` — Overview stats (total listings, pending, inquiries)
- `app/(owner)/listings/page.tsx` — My Listings table/card view with status badges
- `app/(owner)/listings/new/page.tsx` — Add New Listing form:
  - Title, Description, Address, Category (required)
  - Price field (numeric validation — no negatives, no text)
  - Bedrooms / Bathrooms selectors
  - Image upload (multi-image preview via FileReader — no real upload)
  - Submit → status set to `"pending"`, success banner shown
- `app/(owner)/listings/[id]/edit/page.tsx` — Edit Listing (pre-filled form)
- Mark as Rented / Unavailable toggle (inline action on listings table)
- Delete / Remove listing with confirmation modal
- `app/(owner)/inquiries/page.tsx` — Received Inquiries & Appointment Requests
- Shared layout: `app/(owner)/layout.tsx` — owner sidebar nav

---

## Phase 6: Admin Panel
**Goal:** Administrative interface for platform management.

- Route group: `app/(admin)/`
- `app/(admin)/dashboard/page.tsx` — Stats overview:
  - Total active listings, registered users, total inquiries
  - Most viewed properties
  - Listings by category / city (charts)
- `app/(admin)/moderation/page.tsx` — Moderation Queue (all `pending` listings)
- `app/(admin)/moderation/[id]/page.tsx` — Full listing detail review page
  - "Approve Listing" button (enabled only after visiting this page — tracked via cookie or URL param)
  - "Reject Listing" with reason selector + free text
- `app/(admin)/users/page.tsx` — User Management (list + disable accounts)
- `app/(admin)/reports/page.tsx` — Reports & Statistics (charts/tables)
- Shared layout: `app/(admin)/layout.tsx` — admin sidebar nav

---

## Phase 7: Messaging & Notifications UI
**Goal:** Communication layer between customers and owners.

- `app/messages/page.tsx` — Messaging thread list (Customer/Owner)
- `app/messages/[threadId]/page.tsx` — Individual message thread
- Inquiry submission form (modal launched from Property Detail page)
- Appointment request form (modal)
- Notification bell in Navbar (Client Component — reads from Zustand store)
- `app/notifications/page.tsx` — Full notification list

---

## Phase 8: Polish, Responsiveness & Accessibility
**Goal:** Ensure quality across devices and users.

- Full responsive layout (mobile, tablet, desktop) — Tailwind breakpoints `sm`, `md`, `lg`
- Keyboard navigation support on all interactive elements
- ARIA labels and roles on custom components
- `prefers-reduced-motion` respected — use Tailwind's `motion-safe:` variant
- `<Suspense>` boundaries with skeleton screens for every async Server Component
- `app/not-found.tsx` — Custom 404 page
- `app/error.tsx` — Global error boundary
- `app/loading.tsx` — Global loading UI
- Empty states for all list/grid views
- Consistent toast feedback for all form submissions

---

## Phase 9: Final Review & Handoff
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit (Lighthouse / axe DevTools)
- `next build` — verify zero type errors and no build warnings
- Component documentation / Storybook (optional)
- Code cleanup and README update
- Document all mock API touch points in `lib/api/` for backend replacement

---

## App Router File Structure

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
│   ├── property/
│   │   └── [id]/page.tsx
│   ├── search/page.tsx
│   ├── messages/
│   │   ├── page.tsx
│   │   └── [threadId]/page.tsx
│   ├── notifications/page.tsx
│   ├── layout.tsx           # Root layout (fonts, global providers)
│   ├── page.tsx             # Landing page
│   ├── not-found.tsx
│   ├── error.tsx
│   └── loading.tsx
├── components/
│   ├── ui/                  # Button, Input, Badge, Modal, Toast...
│   ├── property/            # PropertyCard, PropertyGallery, PropertyDetail...
│   ├── filters/             # FilterBar, PriceSlider, CategorySelect...
│   ├── forms/               # ListingForm, InquiryForm, AppointmentForm...
│   └── layout/              # Navbar, Footer, Sidebar...
├── lib/
│   ├── data/                # Mock JSON fixtures
│   ├── api/                 # Mock fetch functions (replace with real API later)
│   ├── utils.ts             # formatPrice, cn(), etc.
│   └── validations/         # Zod schemas
├── hooks/                   # Custom client-side hooks
├── store/                   # Zustand stores
├── middleware.ts             # Route protection
├── tailwind.config.ts
└── next.config.ts
```

---

## Page / Route Summary

| Route | File | Role |
|---|---|---|
| `/` | `app/page.tsx` | Public |
| `/search` | `app/search/page.tsx` | Public |
| `/property/[id]` | `app/property/[id]/page.tsx` | Public |
| `/login` | `app/(auth)/login/page.tsx` | Public |
| `/register` | `app/(auth)/register/page.tsx` | Public |
| `/profile` | `app/(customer)/profile/page.tsx` | Customer |
| `/favorites` | `app/(customer)/favorites/page.tsx` | Customer |
| `/inquiries` | `app/(customer)/inquiries/page.tsx` | Customer |
| `/appointments` | `app/(customer)/appointments/page.tsx` | Customer |
| `/owner/dashboard` | `app/(owner)/dashboard/page.tsx` | Owner |
| `/owner/listings` | `app/(owner)/listings/page.tsx` | Owner |
| `/owner/listings/new` | `app/(owner)/listings/new/page.tsx` | Owner |
| `/owner/listings/[id]/edit` | `app/(owner)/listings/[id]/edit/page.tsx` | Owner |
| `/owner/inquiries` | `app/(owner)/inquiries/page.tsx` | Owner |
| `/admin/dashboard` | `app/(admin)/dashboard/page.tsx` | Admin |
| `/admin/moderation` | `app/(admin)/moderation/page.tsx` | Admin |
| `/admin/moderation/[id]` | `app/(admin)/moderation/[id]/page.tsx` | Admin |
| `/admin/users` | `app/(admin)/users/page.tsx` | Admin |
| `/admin/reports` | `app/(admin)/reports/page.tsx` | Admin |
| `/messages` | `app/messages/page.tsx` | Customer/Owner |
| `/messages/[threadId]` | `app/messages/[threadId]/page.tsx` | Customer/Owner |
| `/notifications` | `app/notifications/page.tsx` | Customer/Owner |

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | **Next.js 14** (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | `next/font` (Fraunces + Inter) |
| Images | `next/image` |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Data Fetching | Native `fetch` in Server Components; TanStack Query for client-side |
| Mock API | JSON fixtures in `lib/data/` + async helper functions in `lib/api/` |
| Charts (Admin) | Recharts |
| Image Upload Preview | FileReader API (no real upload) |
| Icons | Lucide React |
| Auth (mock) | Cookie set on login, read by `middleware.ts` |