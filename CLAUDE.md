# ERP Next.js — Claude Code Implementation Guide

> **Context:** Inter-contrat mini-project at NOVITY. Goal: build a modular ERP in Next.js 14+ over 4 weeks to level up on Next.js, TypeScript, and ERP architecture patterns — preparing for future Odoo client missions.

---

## Tech Stack

### Frontend
- **Next.js 14+** — App Router, Server Components, Server Actions
- **React 18** — Hooks, Suspense, concurrent features
- **TypeScript** — strict mode, advanced types, generics
- **Tailwind CSS** — utility-first styling, design system tokens

### Backend
- **Next.js API Routes** — REST endpoints
- **Server Actions** — form mutations, data writes
- **tRPC** *(optional, prefer if comfortable)* — type-safe API layer
- **Zod** — input validation schemas

### Data
- **Prisma ORM** — schema-first, type-safe database client
- **PostgreSQL** — relational database
- **React Query (TanStack Query)** — client-side cache, revalidation, optimistic updates
- **Zustand** — lightweight global state management

### Tooling
- **ESLint + Prettier** — code quality and formatting
- **Jest** — unit and component testing (target: >70% coverage)
- **Playwright** — E2E tests for critical flows
- **Git + GitHub** — version control, pull requests
- **Vercel** — deployment and preview environments

---

## Design System

The visual identity matches the NOVITY roadmap slides. Apply it consistently across all pages and components.

### Color Palette

| Token | Hex | Tailwind custom name | Usage |
|---|---|---|---|
| Black | `#141414` | `brand-black` | Text, borders, navbar background |
| White | `#FFFFFF` | `brand-white` | Card backgrounds, modal surfaces |
| Off-white | `#F2F2ED` | `brand-offwhite` | Page background, table rows |
| Lavender | `#C6C6F0` | `brand-lavender` | Frontend module accent, section badges |
| Peach | `#F5C4AD` | `brand-peach` | Backend / Auth module accent, warnings |
| Mint | `#A8E8D4` | `brand-mint` | Data / Stock module accent, success states |
| Gray | `#888888` | `brand-gray` | Subtitles, placeholders, muted text |
| Light gray | `#E0E0E0` | `brand-light-gray` | Dividers, card borders, input borders |
| Dark gray | `#444444` | `brand-dark-gray` | Body text, list items |

Configure them in `tailwind.config.ts`:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:      '#141414',
          white:      '#FFFFFF',
          offwhite:   '#F2F2ED',
          lavender:   '#C6C6F0',
          peach:      '#F5C4AD',
          mint:       '#A8E8D4',
          gray:       '#888888',
          'light-gray': '#E0E0E0',
          'dark-gray':  '#444444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Arial Black', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

### Module Color Mapping

Each ERP module uses one accent color for its badges, active nav state, and section headers:

| Module | Accent | Token |
|---|---|---|
| CRM — Contacts | Lavender | `brand-lavender` |
| Orders | Lavender | `brand-lavender` |
| Stock & Dashboard | Mint | `brand-mint` |
| Invoices & PDF | Mint | `brand-mint` |
| Auth / Setup | Peach | `brand-peach` |
| Tests & Deploy | Peach | `brand-peach` |

### Typography

```
Display / Page titles  →  Arial Black, bold, #141414
Section headers        →  Arial Bold, 18–24px, #141414
Body text              →  Arial / Inter, 14–16px, #444444
Muted / subtitles      →  Arial, italic, #888888
Labels / badges        →  Arial Bold, 9–11px, uppercase, tracked
```

Rules:
- **One font weight per hierarchy level** — no mixing bold and semi-bold at the same level.
- **Never underline headings** — use whitespace or a colored left border instead.
- **Left-align all body text** — center only page-level titles and stat callouts.

### Spacing & Layout

```
Page padding      →  px-6 py-8  (desktop),  px-4 py-6  (mobile)
Card padding      →  p-5
Gap between cards →  gap-4 (16px)
Section gap       →  mb-10
Border radius     →  rounded  (4px) for cards, rounded-full for badges/pills
```

### Component Patterns

**Cards** — used for modules, KPI blocks, and form containers:
```tsx
<div className="bg-brand-offwhite border border-brand-light-gray rounded p-5">
  ...
</div>
```

**Module badge / pill** — small colored label above a section title:
```tsx
<span className="bg-brand-lavender text-brand-black text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
  CRM
</span>
```

**Left accent bar** — used on week/section cards like in the roadmap:
```tsx
<div className="relative pl-4 border-l-4 border-brand-mint">
  <h3 className="font-bold text-brand-black">Section title</h3>
  <p className="text-brand-dark-gray text-sm">Description</p>
</div>
```

**Stat callout** — KPI numbers on the dashboard:
```tsx
<div className="bg-white border border-brand-light-gray rounded p-4 text-center">
  <p className="text-5xl font-black text-brand-black">42</p>
  <p className="text-xs italic text-brand-gray mt-1">commandes</p>
  <p className="text-sm font-bold text-brand-dark-gray mt-0.5">Ce mois-ci</p>
</div>
```

**Page background** — always `bg-brand-offwhite`, never pure white.

**Sidebar** — dark background `bg-brand-black`, white text, active link highlighted with the module's accent color as a left border or background pill.

### Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use off-white `#F2F2ED` as the page background | Use pure white `#FFFFFF` as the page background |
| Use colored left borders for section hierarchy | Use underlines or horizontal rules under titles |
| Use the module accent for badges and active states | Mix accent colors within the same module |
| Keep cards minimal with a light gray border | Add shadows everywhere — use them only on modals |
| Use Arial Black / Inter for headings | Use more than 2 font families |

---

## Project Structure

Use a **feature-based** folder structure:

```
erp-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + header shell
│   │   ├── page.tsx            # KPI dashboard
│   │   ├── crm/
│   │   │   ├── page.tsx        # Contacts list
│   │   │   ├── [id]/page.tsx   # Contact detail
│   │   │   └── new/page.tsx    # Create contact
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── stock/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── invoices/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── contacts/route.ts
│       ├── orders/route.ts
│       ├── stock/route.ts
│       └── invoices/route.ts
├── components/
│   ├── ui/                     # Reusable primitives (Button, Input, Badge…)
│   ├── layout/                 # Sidebar, Header, PageWrapper
│   ├── crm/                    # ContactCard, ContactForm…
│   ├── orders/
│   ├── stock/
│   ├── invoices/
│   └── dashboard/              # KPICard, Chart wrappers
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   ├── validations/            # Zod schemas per module
│   └── utils.ts
├── hooks/                      # Custom React hooks
├── store/                      # Zustand stores
├── types/                      # Shared TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.local
├── jest.config.ts
└── playwright.config.ts
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  MANAGER
  USER
}

model Contact {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  company   String?
  notes     String?
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id         String      @id @default(cuid())
  reference  String      @unique @default(cuid())
  status     OrderStatus @default(DRAFT)
  contactId  String
  contact    Contact     @relation(fields: [contactId], references: [id])
  lines      OrderLine[]
  total      Float       @default(0)
  notes      String?
  invoices   Invoice[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum OrderStatus {
  DRAFT
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderLine {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Float
  total     Float
}

model Product {
  id          String      @id @default(cuid())
  name        String
  sku         String      @unique
  description String?
  price       Float
  stock       Int         @default(0)
  orderLines  OrderLine[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Invoice {
  id        String        @id @default(cuid())
  number    String        @unique
  orderId   String
  order     Order         @relation(fields: [orderId], references: [id])
  status    InvoiceStatus @default(DRAFT)
  issuedAt  DateTime      @default(now())
  dueAt     DateTime
  total     Float
  paidAt    DateTime?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}
```

---

## Week-by-Week Implementation Plan

### Week 1 — Setup, Architecture & Auth

#### 1A — Setup & Architecture

**Tasks:**
1. Init the project:
   ```bash
   npx create-next-app@latest erp-nextjs --typescript --tailwind --eslint --app --src-dir=false
   ```
2. Enable TypeScript strict mode in `tsconfig.json`:
   ```json
   { "compilerOptions": { "strict": true } }
   ```
3. Install core dependencies:
   ```bash
   npm install prisma @prisma/client zod @tanstack/react-query zustand
   npm install -D @types/node
   npx prisma init
   ```
4. Set up Prisma with the schema above. Run:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
5. Create `lib/prisma.ts` singleton to avoid multiple Prisma client instances in dev.
6. Set up Tailwind design tokens (colors, spacing, fonts) in `tailwind.config.ts`.
7. Build base UI primitives: `Button`, `Input`, `Label`, `Badge`, `Card`, `Spinner`.

**Definition of done:** `npx prisma studio` shows all tables. Design system renders in a Storybook or `/dev` route.

---

#### 1B — Auth & Navigation

**Tasks:**
1. Install NextAuth:
   ```bash
   npm install next-auth @auth/prisma-adapter
   ```
2. Configure NextAuth in `lib/auth.ts` with:
   - Credentials provider (email + password for demo)
   - PrismaAdapter
   - Role-based session (`ADMIN`, `MANAGER`, `USER`)
3. Create `app/api/auth/[...nextauth]/route.ts`.
4. Add `middleware.ts` at the root to protect all `/dashboard/*` routes — redirect unauthenticated users to `/login`.
5. Build the main layout in `app/(dashboard)/layout.tsx`:
   - **Sidebar:** links to Dashboard, CRM, Orders, Stock, Invoices
   - **Header:** logged-in user name, role badge, logout button
6. Implement `app/(auth)/login/page.tsx` with a form using Server Actions.

**Definition of done:** Unauthenticated users are redirected to `/login`. Login works and stores session. Sidebar navigation renders correctly.

---

### Week 2 — CRM Module & Orders Module

#### 2A — Module CRM — Contacts

**Tasks:**
1. Define the Zod schema for contacts in `lib/validations/contact.ts`:
   ```ts
   export const contactSchema = z.object({
     firstName: z.string().min(1),
     lastName:  z.string().min(1),
     email:     z.string().email(),
     phone:     z.string().optional(),
     company:   z.string().optional(),
     notes:     z.string().optional(),
   })
   ```
2. Implement Server Actions in `app/(dashboard)/crm/actions.ts`:
   - `createContact(data)`
   - `updateContact(id, data)`
   - `deleteContact(id)`
3. Build the contacts list page with:
   - Server-side filtered list (search by name/email via URL params)
   - Server-side pagination (limit/offset)
   - Sortable columns
4. Build `ContactForm` component — used for both create and edit.
5. Implement contact detail page `/crm/[id]` showing associated orders.
6. Strictly type all Prisma query results using generated types.

**Definition of done:** Full CRUD on contacts works. Filtering and pagination work server-side.

---

#### 2B — Module Commandes (Orders)

**Tasks:**
1. Define the Zod schema for orders in `lib/validations/order.ts`.
2. Implement Server Actions for orders:
   - `createOrder(data)` — creates order + order lines, calculates total server-side
   - `updateOrderStatus(id, status)`
   - `deleteOrder(id)`
3. Build the orders list page with status filter tabs (Draft / Confirmed / Shipped / Delivered / Cancelled).
4. Build the order detail page showing:
   - Order lines table (product, qty, unit price, line total)
   - Order summary with subtotal and total computed server-side
   - Status change button with role-based permission check
5. Set up React Query in `app/providers.tsx`. Use `useQuery` + `useMutation` for client-side interactions (optimistic status updates).
6. Write Jest unit tests for:
   - Total calculation logic
   - Zod schema validations
   - `OrderStatus` state machine transitions

**Definition of done:** Orders can be created with multiple lines, status updated, totals computed server-side. At least 3 Jest tests passing.

---

### Week 3 — Stock, Dashboard & Invoices

#### 3A — Module Stock & Dashboard

**Tasks:**
1. Implement Server Actions for products:
   - `createProduct(data)`
   - `updateProduct(id, data)`
   - `updateStock(id, delta)` — increment/decrement stock quantity
2. Build the stock list page with:
   - Low-stock warning badge (stock < 5)
   - Inline stock adjustment
3. Build the KPI Dashboard at `app/(dashboard)/page.tsx`:
   - Use Prisma `groupBy` and `count` aggregations to compute:
     - Total revenue (sum of paid invoices)
     - Orders by status (count per `OrderStatus`)
     - Top 5 products by quantity sold
     - Low-stock products count
4. Implement charts using **Recharts**:
   ```bash
   npm install recharts
   ```
   - Bar chart: monthly revenue
   - Pie chart: orders by status
   - Line chart: stock evolution (if tracking history)
5. Implement optimistic updates with React Query for stock adjustments.

**Definition of done:** Dashboard renders with live data. Charts display correct aggregated data. Stock updates reflect immediately via optimistic UI.

---

#### 3B — Facturation & PDF

**Tasks:**
1. Install PDF and email dependencies:
   ```bash
   npm install @react-pdf/renderer resend
   ```
2. Create `InvoiceDocument` React PDF component with:
   - Company header, invoice number, issue and due dates
   - Line items table
   - Total and payment status
3. Implement Server Action `generateInvoicePDF(invoiceId)` that streams the PDF as a response.
4. Add invoice status management:
   - `DRAFT → SENT → PAID` happy path
   - `OVERDUE` auto-flag via a cron-style check on `dueAt`
5. Implement `sendInvoiceEmail(invoiceId)` using Resend:
   - Attach generated PDF
   - Send to contact email
6. Document all API routes using **Swagger / OpenAPI**:
   ```bash
   npm install swagger-ui-react next-swagger-doc
   ```
   - Add `app/api/docs/route.ts` serving the OpenAPI spec
   - Add `/api-docs` page rendering Swagger UI

**Definition of done:** Invoice PDF generates and downloads. Email sends with PDF attached. `/api-docs` renders all documented endpoints.

---

### Week 4 — Quality, Tests & Deployment

#### 4A — Qualité & Tests

**Tasks:**
1. Set up Jest for unit + component tests:
   ```bash
   npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest
   ```
   Configure `jest.config.ts` with path aliases matching `tsconfig.json`.
2. Write unit tests targeting **>70% coverage**:
   - Zod validation schemas (valid and invalid inputs)
   - Order total calculation
   - Invoice status transitions
   - Utility functions in `lib/utils.ts`
3. Set up Playwright for E2E tests:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```
4. Write E2E tests for critical flows in `tests/e2e/`:
   - `auth.spec.ts` — login, redirect, logout
   - `crm.spec.ts` — create contact, search, edit, delete
   - `orders.spec.ts` — create order, add lines, change status
   - `invoice.spec.ts` — generate PDF, mark as paid
5. Run Lighthouse audit on the dashboard page. Target scores:
   - Performance ≥ 85
   - Accessibility ≥ 90
   - Best Practices ≥ 90
6. Code review pass:
   - Remove all `any` types
   - Replace `@ts-ignore` with proper types
   - Ensure all Prisma query results are typed with generated types

**Definition of done:** `jest --coverage` reports >70%. All E2E tests pass. No `any` types remaining.

---

#### 4B — Déploiement & Démo

**Tasks:**
1. Prepare environment variables for production:
   ```
   DATABASE_URL=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   RESEND_API_KEY=
   ```
2. Deploy to **Vercel**:
   - Connect GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Run `prisma migrate deploy` via a postbuild script or Vercel build command
3. Write `README.md` including:
   - Project description and architecture overview
   - Local setup instructions (`clone → .env → migrate → seed → dev`)
   - Tech stack with links
   - Screenshots of each module
   - Link to live Vercel deployment
4. Write `ARCHITECTURE.md` documenting:
   - Folder structure rationale
   - Data flow (Server Action → Prisma → Response)
   - Auth flow (NextAuth → Middleware → Session)
   - Module dependency graph
5. Prepare final demo for manager:
   - Live walk-through of each module
   - Show test coverage report
   - Show Lighthouse scores
   - Learnings summary: what worked, what was hard, what to explore next

**Definition of done:** App is live on Vercel. README is complete. Demo is ready.

---

## Weekly Rhythm

| Day | Activity |
|-----|----------|
| **Monday** | Read docs, define tasks for the week, update GitHub issues |
| **Tue – Thu** | Focused development — features + tests |
| **Friday** | Personal code review, refactor, push + open PR on GitHub |
| **Weekly** | Live demo to manager — show progress + answer questions |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Duration | 4 weeks |
| Test coverage (Jest) | > 70% |
| Modules delivered | 3 (CRM, Orders, Stock) + Invoices as bonus |
| Live demo to manager | 1 per week |
| Deployed app | ✅ on Vercel |

---

## Deliverables Checklist

- [ ] Public GitHub repo with complete README
- [ ] ERP application deployed on Vercel
- [ ] Module CRM — Contacts (full CRUD, search, pagination)
- [ ] Module Orders (lines, status machine, server-side totals)
- [ ] Module Stock (products, stock levels, low-stock alerts)
- [ ] Module Invoices (PDF generation, email, status)
- [ ] Authentication & role-based access control
- [ ] KPI Dashboard with charts (Recharts)
- [ ] Jest test suite with >70% coverage
- [ ] Playwright E2E tests for critical flows
- [ ] API documentation (Swagger UI at `/api-docs`)
- [ ] Technical architecture documentation

---

## Key Conventions

- **Always use Server Actions** for mutations (create, update, delete) — avoid client-side fetch for writes.
- **Validate with Zod** on every Server Action before touching the database.
- **Never use `any`** — use `unknown` and narrow, or generate types from Prisma.
- **Co-locate tests** with their module: `components/crm/__tests__/ContactForm.test.tsx`.
- **Commit messages** follow Conventional Commits: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`.
- **One PR per feature** — keep PRs small and reviewable.
