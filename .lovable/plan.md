
# HireForge AI — Build Plan

A full-stack PWA for AI job hunting + resume tailoring. Big scope, so I'll ship it in clear phases and call out a few stack adaptations up front.

## Stack adaptations (important)

Your spec lists React Router v6 + a generic Supabase setup. This Lovable template is **TanStack Start + TanStack Router** with a managed Supabase integration (Lovable Cloud). I'll adapt accordingly — same functionality, idiomatic to the stack:

- Routing: TanStack Router file-based routes under `src/routes/` (not React Router v6). All URLs in your spec stay identical.
- Auth gate: protected routes live under `src/routes/_authenticated/` using the integration-managed gate (redirects to `/auth`).
- Supabase: Lovable Cloud (managed Supabase). Google OAuth via the Lovable broker.
- Drag & drop: `@dnd-kit/core` as requested.
- State: Zustand for auth/profile stores as requested.
- Charts: Recharts (dashboard stats).
- PWA: manifest-only install support (icons, theme color, standalone). No offline service worker unless you ask — service workers in Lovable preview cause stale-cache issues.
- Backend AI/job-search: per your spec, these are placeholders with mock data + "Connect backend" notes. No FastAPI wiring this pass.

## Phases

1. **Foundation**
   - Enable Lovable Cloud
   - Design system in `src/styles.css` (dark theme, indigo/violet, glassmorphism tokens, Inter font via `<link>`)
   - PWA manifest + icons + head tags
   - Database migration: all 13 tables + RLS + grants + auto-profile trigger on signup + completeness recompute helper
   - Zustand stores, types, hooks

2. **Auth + Shell**
   - `/auth` page (email/password tabs + Google via Lovable broker)
   - Top navbar (desktop) + bottom tab bar (mobile)
   - `_authenticated` layout (managed)
   - Root layout with Sonner toaster, providers

3. **Dashboard** (`/dashboard`) — stats cards, today's jobs, recent tailored resumes, quick actions, completeness bar

4. **Profile** (`/profile/*`) — 7 sub-sections with full CRUD, completeness score recalc, first-login banner redirect

5. **Jobs**
   - `/jobs` — search + filters + mock job cards (3 demos + "connect backend" notice)
   - `/jobs/database` — table view, sortable, CSV export
   - `/jobs/:id` — detail + match breakdown
   - `/jobs/tracker` — `@dnd-kit` kanban, 5 columns, side drawer

6. **Resume Tailor**
   - `/tailor` — two-panel UI with mock result preview
   - `/history` — grid of past tailored resumes

7. **Settings** (`/settings`) — 3 tabs: search schedule, account, search logs

## Technical notes

- Tables: every `CREATE TABLE` gets `GRANT … TO authenticated`, RLS enabled, policies scoped to `auth.uid()`. `jobs` is global-read for authenticated users; `user_jobs`, `resumes`, `tailored_resumes`, `search_*`, profile-related tables are owner-only.
- Auto-create `profiles` row on `auth.users` insert via trigger.
- `completeness_score` updated client-side after each profile section save (simpler than DB trigger across 7 tables).
- File uploads (resume PDFs) → Supabase Storage bucket `resumes` (private, owner RLS).
- Mobile bottom tab bar shown `< md`, top nav `>= md`.
- Skeletons + empty states everywhere async.

## Out of scope this pass

- Real job scraping / FastAPI integration (mocked per your spec)
- Real AI tailoring (mocked per your spec)
- Push notifications (would need a separate FCM service worker)
- Offline PWA mode

Approve and I'll start with Phase 1 (Cloud + schema + design system + PWA + shell) in one batch, then move through the remaining phases.
