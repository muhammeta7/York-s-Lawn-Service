# York's Lawn Service — Website

A booking site for York's Lawn Service (Salem & Gloucester County, NJ). Customers can
request estimates / book jobs on a calendar that automatically hides full or blocked
days, and pay via Cash App ($YorkMGross). The owner manages everything from a
password-protected `/admin` page.

Total hosting cost at this traffic level: **$0/month** (Vercel free tier + Supabase free tier).

## What's included

- Public site (`/`) — services & pricing, booking/estimate form with a live calendar,
  Cash App payment link + QR code, contact info.
- Owner admin portal (`/admin`, login at `/admin/login`) — view every booking, change
  its status, add a client/job manually, and block off days (vacation, weather, etc.)
  so they stop showing as available.
- Double-booking protection — the calendar hides Sundays, any date the owner blocked,
  and any date that already has 3 jobs booked (edit this cap in two places, see below).

## One-time setup

### 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier).
2. Once it's created, open **SQL Editor** → New query, paste in the contents of
   `supabase/schema.sql` from this project, and run it. This creates the `bookings`
   and `blocked_dates` tables plus the security rules that keep customer data private.
3. Go to **Authentication → Users → Add user** and create the owner's login
   (an email + password). This is what you'll use to sign in at `/admin/login`.
   Only create one account — anyone who can log in has full admin access.
4. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` `public` key

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the two values from above:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### 3. Run it locally (optional, to preview before deploying)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login`
for the owner portal.

### 4. Deploy for free on Vercel

1. Push this folder to a GitHub repo (or use `vercel` CLI directly without git).
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. In the project's **Settings → Environment Variables**, add the same two Supabase
   values from step 2.
4. Deploy. Vercel gives you a free `*.vercel.app` URL immediately; you can attach a
   custom domain (e.g. `yorkslawnservice.com`) for free in Settings → Domains (you'd
   only pay if you buy the domain itself, typically ~$10–15/year from a registrar).

That's it — no server to manage, no monthly hosting bill at this traffic level.

## Day-to-day use

- **Customers**: fill out the form under "Book a Job / Request an Estimate." They pick
  a date (already-booked/blocked days are greyed out), submit, and the request lands
  in the owner's `/admin` dashboard as "Pending." They pay after the job is done via
  the Cash App button/QR code further down the page.
- **Owner**: log in at `yoursite.com/admin/login`. From the dashboard you can:
  - See every booking, sorted by date, with contact info.
  - Change a booking's status (Pending → Confirmed → Completed, or Cancelled).
  - Click **+ Add Client / Job** to manually enter a booking (e.g. a phone-in customer).
  - Block off a date (vacation, bad weather, fully booked) so it disappears from the
    public calendar.

## Adjusting business details

Almost everything customer-facing (name, phone, service area, hours, pricing,
Cash App tag) lives in one file: `src/lib/business.ts`. Edit it and redeploy — no
need to touch the rest of the code.

The "how many jobs per day before a date is full" cap is currently **3**, and needs to
be changed in two spots if you want a different number:

- `maxJobsPerDay` in `src/lib/business.ts` (used for the on-page note to customers)
- the `>= 3` line inside `get_unavailable_dates()` in `supabase/schema.sql` (the actual
  enforcement — re-run that function's `create or replace` block in the Supabase SQL
  Editor after changing it)

## Notes on Cash App

Cash App doesn't offer a public payments API, so there's no way to auto-confirm a
payment or charge a specific amount from the website. The site instead shows your
$YorkMGross tag as a tappable link and QR code; the customer completes the payment
inside the Cash App itself after the job is done.

## Tech stack

Next.js 14 (App Router) + Tailwind CSS, Supabase (Postgres database + auth), deployed
on Vercel. All free-tier.
