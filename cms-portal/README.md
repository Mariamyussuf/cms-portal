# College of Management Sciences — site & payment portal

Bells University of Technology. Next.js 16 (App Router) + TypeScript +
Tailwind v4, PostgreSQL via Prisma, NextAuth v5 for auth, Bachs.io for
payments (behind an abstraction — see below).

## First thing to do after cloning

This project was scaffolded in a sandboxed environment with a restricted
network allowlist that blocks two things Prisma and Playwright need:
`binaries.prisma.sh` and browser-download CDNs. Neither is a problem on a
normal machine or CI, but it means two things were **not verified here**
and need to be your first step:

```bash
npm install          # triggers `prisma generate` via postinstall
npx prisma validate  # confirm schema.prisma has no syntax errors
```

I hand-checked `prisma/schema.prisma` carefully (model/enum structure,
every `@relation` pair, brace balance) but could not run the actual
Prisma CLI against it. Run `prisma validate` before trusting it fully.

You'll also want to actually look at the rendered homepage — I could not
get a real browser screenshot in this sandbox (font CDN and browser-binary
downloads were both blocked), so the visual design has been built to spec
but not visually confirmed by me. Run `npm run dev` and look at `/`
yourself before we iterate further on the design.

## Set up the database

1. Create a Postgres database (local Postgres, Supabase's Postgres-only
   mode, Neon, Railway — anything works, this isn't locked to a vendor).
2. Update `DATABASE_URL` in `.env`.
3. Run `npm run db:push` to create tables from `prisma/schema.prisma`
   (use `prisma migrate dev` instead once you want real migration
   history rather than just pushing schema state).

## Payments — Bachs.io status

**This is the most important thing to read before going further.**

`src/lib/payments/` contains a provider-agnostic interface
(`provider.ts`) and a Bachs implementation (`bachs.ts`) that is
**intentionally left as a scaffold, not a finished integration**. Here's
exactly why, and what to do about it:

- Bachs's public docs (docs.bachs.io) are mostly marketing copy. The full
  API reference is behind signup at app.bachs.io.
- What I could confirm from public sources:
  - Base URLs: `https://sandbox-api.bachs.io/v1` and `https://api.bachs.io/v1`
  - Auth: `Authorization: Bearer sk_sandbox_...` / `sk_live_...`
  - Money is sent as a **decimal string** ("29.00"), not minor units —
    this app stores amounts in kobo internally (`amountKobo` on
    `FeeStructure`/`AssociationDues`/`Payment`) and needs a
    `koboToDecimalString()` conversion at the API boundary (already
    stubbed in `bachs.ts`).
  - **₦1,000 minimum transaction size** — check this against your
    smallest real fee or dues amount.
  - Checkout sessions are created against a pre-existing `product_id` —
    Bachs looks catalog/subscription-first, not "charge this arbitrary
    amount right now." This is a real architectural question for a fee
    portal with per-student amounts. Two ways to handle it, pick one
    once you've read the real API reference:
    (a) create/update a Bachs product per `FeeStructure`/`AssociationDues`
    row whenever its amount changes, and store the resulting product ID
    on that row, or
    (b) confirm whether Bachs actually supports inline/dynamic pricing
    at checkout time (some similar platforms do — Bachs's docs didn't
    confirm or deny this).
  - Webhooks are the source of truth for fulfilment — never trust the
    browser redirect alone.
  - Webhook requests are signed; your server clock needs to be within
    ~300 seconds of real time or verification will fail.
  - Supported store currencies today: **NGN and USD only** — fine for us.
- What is **not confirmed** and is marked clearly with comments in
  `bachs.ts`: the exact webhook event names beyond `collection.succeeded`,
  the webhook signature header name/algorithm, and the full
  checkout-session response shape. The signature-check code in
  `bachs.ts` is a reasonable placeholder (HMAC-SHA256, timing-safe
  compare) but the header name is a guess.

**Action item:** once you have Bachs dashboard access, read
`/api-reference` and `/developer-portal/webhooks` there, then fill in
the two `throw new Error(...)` stubs in `src/lib/payments/bachs.ts`
(`createCheckout` and `verifyPayment`) and correct the webhook parsing.
Everything else in the app — the `Payment` model, the checkout flow UI,
the webhook route — is written against the `PaymentProvider` interface
in `provider.ts`, so this is the only file that needs real work.

If Bachs turns out not to fit (the product-catalog requirement is the
likely blocker), swapping to Paystack or Flutterwave means writing one
new file (`src/lib/payments/paystack.ts`) implementing the same
interface and changing one line in `src/lib/payments/index.ts`. Nothing
else in the app changes.

## What's built so far

- Prisma schema modeling: users/auth, students, staff, departments,
  news posts, associations (each with leaders/events/dues — per your
  request, each association gets its own mini-page), fee structures,
  payments, receipts, and an audit log.
- NextAuth v5 credentials login — students can sign in with either
  matric number or email (`src/lib/auth/config.ts`).
- Homepage (`src/app/page.tsx` + `src/components/marketing/`) — the
  design direction is a "registrar's bulletin index," not a generic
  SaaS gradient hero. Deep ink-navy + brass/gold + paper palette,
  Fraunces (serif display) paired with Inter (body/UI), one deliberate
  motion moment (stat counters animate up once on scroll-into-view via
  IntersectionObserver), department/association listings styled as a
  bulletin's table of contents with functional hairline dividers.

## What's not built yet

- Department detail pages, association mini-pages, admissions/news
  pages, the student dashboard, the admin/bursary dashboard, the actual
  payment checkout flow UI, and the webhook route itself. The
  architecture (schema + auth + payments interface) is in place to
  build all of these next — say the word and I'll keep going.

## Commands

```bash
npm install       # install deps, generates Prisma client
npm run dev       # start dev server
npm run build     # production build (type-checks too)
npm run db:push   # sync schema.prisma to your database
npm run db:studio # Prisma Studio — browse/edit data visually
```
