# NOVITY ERP — Implementation Progress

> Roadmap source: `CLAUDE.md` — 4-week inter-contrat mini-project.
> Updated after each phase. Use this file for manager weekly demos.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| 🔄 | In progress |
| ⬜ | Not started |
| ⚠️ | Blocked / issue encountered |

---

## Week 1 — Setup, Architecture & Auth

### Phase 1A — Setup & Architecture
**Completed: 2026-06-03**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Init Next.js 14 project (App Router, TypeScript, Tailwind, ESLint) | ✅ | `create-next-app` with `--app --typescript --tailwind --eslint` |
| 2 | Enable TypeScript strict mode in `tsconfig.json` | ✅ | Already on by default in Next.js 14+ |
| 3 | Install core deps: Prisma, Zod, React Query, Zustand | ✅ | Also installed `dotenv`, `@prisma/adapter-pg`, `pg` |
| 4 | Set up Prisma schema (User, Contact, Order, OrderLine, Product, Invoice) | ✅ | Adapted for Prisma v7 (driver adapter pattern, no URL in schema) |
| 5 | Run `prisma migrate dev --name init` | ✅ | All 7 tables created in `novity_erp` database |
| 6 | Run `prisma generate` | ✅ | Client generated at `app/generated/prisma/` |
| 7 | Create `lib/prisma.ts` singleton | ✅ | Uses `PrismaPg` adapter + `globalThis` guard against hot-reload leaks |
| 8 | Set up Tailwind design tokens (NOVITY brand colors, fonts) | ✅ | Tailwind v4: tokens in `globals.css` `@theme` block (no `tailwind.config.ts`) |
| 9 | Build base UI primitives: Button, Input, Badge, Card, Spinner | ✅ | All in `components/ui/`, barrel-exported from `index.ts` |

**Deviations from roadmap:**
- Prisma v7 was installed (roadmap assumed v5/v6). Required `@prisma/adapter-pg` + `pg` — the old binary connector is gone in v7.
- Tailwind v4 was installed (roadmap assumed v3). Tokens moved from `tailwind.config.ts` to `globals.css @theme` block.
- `User` model: added `password` field (roadmap omitted it but it's required for Credentials auth in Phase 1B).
- No Storybook or `/dev` route created (deprioritized — primitives verified via TypeScript compilation and dev server start).

---

### Phase 1B — Auth & Navigation
**Completed: 2026-06-03**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Install NextAuth + PrismaAdapter | ✅ | NextAuth v4.24.14 + bcryptjs for password hashing |
| 2 | Configure NextAuth (`lib/auth.ts`) — Credentials provider, roles | ✅ | JWT strategy; role stored in token and surfaced via session callback |
| 3 | Create `app/api/auth/[...nextauth]/route.ts` | ✅ | Catch-all handler exporting GET + POST |
| 4 | Route protection for `/dashboard/*` | ✅ | `proxy.ts` (Next.js 16 replaced `middleware.ts` with `proxy.ts`) |
| 5 | Build dashboard layout (`app/(dashboard)/layout.tsx`) — Sidebar + Header | ✅ | Sidebar = Client Component (usePathname), Header = Server Component (getServerSession) |
| 6 | Implement login page with auth form | ✅ | LoginForm is a Client Component (uses signIn from next-auth/react) |
| 7 | Seed admin user | ✅ | `prisma/seed.ts` — admin@novity.fr / admin1234 |

**Deviations from roadmap:**
- PrismaAdapter was NOT used: with Credentials-only auth, JWT strategy is simpler and doesn't require NextAuth's `Account`/`Session`/`VerificationToken` models in the schema. The adapter adds value for OAuth providers (Google, GitHub) which we don't have.
- `middleware.ts` → `proxy.ts`: Next.js 16 renamed the file convention.
- Login form is a Client Component (not a Server Action): NextAuth v4 has no server-side `signIn()` equivalent. Server Actions apply to our own data mutations (Phase 2+).

**Definition of done:** ✅ Unauthenticated `GET /dashboard` → 307 to `/login?callbackUrl=/dashboard`. Login renders. Admin user in DB.

---

## Week 2 — CRM & Orders

### Phase 2A — CRM Module (Contacts)
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Zod schema for contacts (`lib/validations/contact.ts`) | ⬜ | |
| 2 | Server Actions: `createContact`, `updateContact`, `deleteContact` | ⬜ | |
| 3 | Contacts list page — server-side search, pagination, sort | ⬜ | |
| 4 | `ContactForm` component (create + edit) | ⬜ | |
| 5 | Contact detail page `/crm/[id]` with associated orders | ⬜ | |

**Definition of done:** Full CRUD on contacts. Filtering and pagination work server-side.

---

### Phase 2B — Orders Module
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Zod schema for orders (`lib/validations/order.ts`) | ⬜ | |
| 2 | Server Actions: `createOrder`, `updateOrderStatus`, `deleteOrder` | ⬜ | |
| 3 | Orders list page with status filter tabs | ⬜ | |
| 4 | Order detail page — lines table, totals, status change with RBAC | ⬜ | |
| 5 | Set up React Query (`app/providers.tsx`) — optimistic status updates | ⬜ | |
| 6 | Jest unit tests — total calculation, Zod schemas, status machine | ⬜ | |

**Definition of done:** Orders with multiple lines. Status updates. Totals server-side. ≥3 Jest tests passing.

---

## Week 3 — Stock, Dashboard & Invoices

### Phase 3A — Stock & Dashboard
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Server Actions: `createProduct`, `updateProduct`, `updateStock` | ⬜ | |
| 2 | Stock list page — low-stock warnings, inline adjustment | ⬜ | |
| 3 | KPI Dashboard — Prisma aggregations (revenue, orders by status, top products) | ⬜ | |
| 4 | Install Recharts — bar chart, pie chart, line chart | ⬜ | |
| 5 | Optimistic updates (React Query) for stock adjustments | ⬜ | |

**Definition of done:** Dashboard with live data and charts. Stock updates reflect via optimistic UI.

---

### Phase 3B — Invoices & PDF
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Install `@react-pdf/renderer` + `resend` | ⬜ | |
| 2 | `InvoiceDocument` React PDF component | ⬜ | |
| 3 | Server Action `generateInvoicePDF(invoiceId)` — streams PDF | ⬜ | |
| 4 | Invoice status management — `DRAFT → SENT → PAID`, overdue flag | ⬜ | |
| 5 | `sendInvoiceEmail(invoiceId)` via Resend — attach PDF | ⬜ | |
| 6 | Swagger / OpenAPI docs at `/api-docs` | ⬜ | |

**Definition of done:** PDF generates and downloads. Email sends with PDF. `/api-docs` renders all endpoints.

---

## Week 4 — Quality, Tests & Deployment

### Phase 4A — Tests & Quality
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Set up Jest + Testing Library (`jest.config.ts`) | ⬜ | |
| 2 | Unit tests — Zod schemas, order totals, invoice transitions, utils | ⬜ | |
| 3 | Reach >70% Jest coverage | ⬜ | |
| 4 | Set up Playwright (`playwright.config.ts`) | ⬜ | |
| 5 | E2E: `auth.spec.ts` | ⬜ | |
| 6 | E2E: `crm.spec.ts` | ⬜ | |
| 7 | E2E: `orders.spec.ts` | ⬜ | |
| 8 | E2E: `invoice.spec.ts` | ⬜ | |
| 9 | Lighthouse audit — Performance ≥85, Accessibility ≥90, Best Practices ≥90 | ⬜ | |
| 10 | Code review pass — remove all `any`, type all Prisma results | ⬜ | |

**Definition of done:** `jest --coverage` >70%. All E2E tests pass. No `any` types.

---

### Phase 4B — Deployment & Demo
**Status: ⬜ Not started**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Prepare production env vars | ⬜ | |
| 2 | Deploy to Vercel — connect GitHub, add env vars, run `prisma migrate deploy` | ⬜ | |
| 3 | Write `README.md` | ⬜ | |
| 4 | Write `ARCHITECTURE.md` | ⬜ | |
| 5 | Prepare final manager demo | ⬜ | |

**Definition of done:** App live on Vercel. README complete. Demo ready.

---

## Overall Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| 1A — Setup & Architecture | ✅ Done | 2026-06-03 |
| 1B — Auth & Navigation | ✅ Done | 2026-06-03 |
| 2A — CRM Module | ⬜ Not started | — |
| 2B — Orders Module | ⬜ Not started | — |
| 3A — Stock & Dashboard | ⬜ Not started | — |
| 3B — Invoices & PDF | ⬜ Not started | — |
| 4A — Tests & Quality | ⬜ Not started | — |
| 4B — Deployment & Demo | ⬜ Not started | — |

**Phases complete: 2 / 8**
