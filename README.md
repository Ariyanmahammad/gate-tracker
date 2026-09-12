# GATE CSE 2027 Prep Tracker

A personal daily study tracker seeded with Ariyan's actual GATE 2027 schedule
(handwritten Day/Night plan for 9-28 Sep 2026, and the typed "GATE 2027 CSE
Master Plan" for 30 Sep 2026 - 7 Feb 2027).

## Stack
React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts + React Router.
No backend - everything is stored in the browser's localStorage.

## Run locally

    npm install
    npm run dev

Open the printed local URL (usually http://localhost:5173).

## Build for production

    npm run build
    npm run preview   # optional: preview the production build locally

The build output goes to dist/.

## Where your data lives

Everything you submit (task progress, PYQ numbers, test scores, error log,
schedule edits) is saved to localStorage under the key
gate2027.appState.v1, in this browser only. Nothing is sent anywhere.

- Back it up: Edit Schedule -> Export Data (JSON). Do this periodically -
  browser storage can be cleared by the OS/browser or by clearing site data.
- Restore/move to another device: Edit Schedule -> Import Data (JSON).

## Where the schedule itself lives

The seeded plan is in src/data/seedSchedule.ts (auto-generated from your
uploaded schedule). It's the read-only "source of truth"; your day-to-day
edits are layered on top of it in localStorage, so re-seeding never wipes
your submitted progress. A handful of entries are flagged needsReview where
the source handwriting/PDF was ambiguous or a page was missing - see
Edit Schedule in the app, it opens showing exactly those flagged items.

## Adding future schedule dates

Two options:
1. In the app: Edit Schedule -> Add Task (fastest for a few tasks).
2. In code: append more objects to the SEED_TASKS array in
   src/data/seedSchedule.ts, following the existing shape:

       { id: '2027-02-08-morning', date: '2027-02-08', session: 'Morning', subject: 'OS', topic: '...', phase: 2 }

   Rebuild/redeploy afterward. Existing progress is keyed by task id, so as
   long as you don't reuse an id for a different task, old data stays intact.

## Deploying

The app is a static site after npm run build (just the dist/ folder), so
any static host works. Three easy options:

### Option A - Vercel (recommended, free)
1. Push this folder to a GitHub repo.
2. Go to vercel.com -> Add New Project -> import the repo.
3. Framework preset: Vite (auto-detected). Build command `npm run build`,
   output directory `dist` (auto-detected).
4. Deploy. You'll get a https://your-project.vercel.app URL.

### Option B - Netlify (free)
1. Push this folder to a GitHub repo (or drag-and-drop the dist/ folder
   after building, at app.netlify.com/drop).
2. If connecting via Git: build command `npm run build`, publish directory
   `dist`.
3. Deploy.

### Option C - GitHub Pages
1. npm install -D gh-pages
2. In vite.config.ts, add: base: '/<your-repo-name>/'
3. Add to package.json scripts: "deploy": "vite build && gh-pages -d dist"
4. npm run deploy, then enable Pages for the gh-pages branch in the repo
   settings.

Since everything runs client-side with no server/database, there's no
environment configuration needed for any of these.

## Known simplifications from the original spec
- Used plain Tailwind components instead of a shadcn/ui install, to keep the
  project dependency-light - visuals follow the same clean/academic brief.
- Storage is localStorage only (as the spec allowed for v1); the data
  layer (src/utils/tasks.ts, src/types.ts) is structured so swapping in a
  real backend/IndexedDB later doesn't require touching page components.
