# nff-fag-v2

MVP webapp for NFF referee department to upload, tag, and publish match situation video clips with professional conclusions.

## MVP features

- Admin login (Supabase Auth + `admins` table)
- Upload `.mp4` clips to Supabase Storage bucket `clips`
- Tag clips by:
  - Situasjonstype: Taklinger, DOGSO/SPA, Straffespark, Hands, Offside, Management, Samarbeid, Laws of the game
  - Liga: Eliteserien, OBOS-ligaen, Toppserien, 1. divisjon kvinner, 2. divisjon menn
  - Runde
  - Kampnummer
- Add a text conclusion to each clip
- Admin dashboard with publish toggle, title/conclusion edit, delete
- Public viewer portal on secret slug route (`/{secretSlug}`) with:
  - Newest clips first (default)
  - Filter by situation type and league
  - Native video controls
  - `Konklusjon` button with modal
- Viewer route is `noindex, nofollow`

## Tech stack

- Next.js (App Router, TypeScript)
- Supabase (Auth, Postgres, Storage)
- Vitest (unit tests)
- Playwright (basic e2e)

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env.local
```

3. Fill in required variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VIEWER_SECRET_SLUG` (default `dommerportal-nff`)
- `MATCH_LOOKUP_PROVIDER` (`mock` or `nff_api`)

4. Run Supabase SQL schema:

- Open Supabase SQL editor
- Execute `supabase/schema.sql`

5. Create at least one auth user in Supabase and grant admin rights:

- Insert that user id into `public.admins`

6. Start dev server:

```bash
npm run dev
```

## Match number lookup provider

- `MATCH_LOOKUP_PROVIDER=mock` (default): deterministic mock response + manual fallback
- `MATCH_LOOKUP_PROVIDER=nff_api`: uses `NFF_API_ENDPOINT` + `NFF_API_KEY`

If API lookup fails, admin can still set league/round manually.

## Test commands

```bash
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
```

## Repository bootstrap used for this project

```bash
git init
git checkout -b main
gh repo create nff-fag-v2 --private --source=. --remote=origin --push
```
