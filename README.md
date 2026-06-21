# Joshua Phiri — Portfolio

A two-sided portfolio site:

- **Public site** (`/`) — what clients and recruiters see: profile, education,
  experience, projects, achievements, contact details, and a downloadable CV.
- **Admin dashboard** (`/admin`) — private, password-protected. From here you
  add/edit experience, projects, achievements, and upload photos, documents,
  and videos. Changes appear on the public site immediately.

Built with **Next.js** (hosting on **Vercel**, free) and **Supabase** (free)
for the database, file storage, and admin login.

---

## 1. Create your Supabase project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is fine).
2. Click **New project**. Pick any name/region, set a database password
   (save it somewhere safe — you won't need it day-to-day, but keep it).
3. Once the project is ready, go to **SQL Editor** in the left sidebar →
   **New query**.
4. Open `supabase/schema.sql` in this project, copy the **entire contents**,
   paste into the SQL editor, and click **Run**.
   - This creates all your tables, sets the security rules so the public can
     only *view* content and only you (signed in) can *edit* it, creates the
     file storage bucket, and seeds your site with the content already on
     your CV so it looks complete from day one.
5. Go to **Authentication → Users** in the sidebar → **Add user** →
   **Create new user**. Use the email and password you want to log in with.
   This is the *only* account that can reach `/admin`.
6. Go to **Settings → API**. You'll need two values from this page in step 2:
   - **Project URL**
   - **anon public** key (NOT the `service_role` key — never use that one
     in this app)

## 2. Connect the code to your Supabase project

In this project folder, create a file called `.env.local` (copy
`.env.local.example` as a starting point) and fill in the two values from
step 1.6:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it locally to check everything works

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to log in with the email/password you created
in step 1.5.

## 4. Deploy to Vercel (free)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign up with GitHub, click
   **Add New → Project**, and import the repository.
3. In the **Environment Variables** section during setup, add the same two
   variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel gives you a live URL (e.g.
   `joshua-phiri.vercel.app`) within a minute or two.
5. Later, if you buy a custom domain, add it under your Vercel project's
   **Settings → Domains** — still free, you just pay for the domain itself.

From then on, any time you push a code change to GitHub, Vercel redeploys
automatically. **Content changes (experience, projects, photos, etc.) never
need a redeploy** — those go live the moment you save them in `/admin`.

---

## Day-to-day use

- Log in at `yourdomain.com/admin`.
- **Experience** — add/edit roles, shown as statement-style entries.
- **Projects & Media** — add a project, then upload a cover image and any
  number of photos, PDFs, or videos to it. There's also a general media
  library for files not tied to a specific project (e.g. certificates).
- **Achievements** — certifications, awards, recognitions.
- **Site Settings** — your name, headline, bio, contact info, profile photo,
  and CV file.

## Project structure (for future reference)

```
src/
  app/
    page.tsx                 → public homepage
    admin/
      login/                 → public login page
      (protected)/           → everything below this requires login
        page.tsx              → admin overview
        experience/
        projects/
        achievements/
        settings/
    actions/                  → server-side functions that write to the database
  components/                 → public site sections
  components/admin/           → admin dashboard UI
  lib/
    supabase/                 → Supabase client setup (browser, server, middleware)
    content.ts                → public data-fetching functions
    types/                    → shared TypeScript types
supabase/
  schema.sql                  → run once in Supabase SQL Editor to set everything up
```

## Security notes

- The `anon` key is meant to be public (it's used in the browser) — it has no
  special power on its own. Real protection comes from the **Row Level
  Security** rules in `schema.sql`: anyone can *read* your public content,
  but only a signed-in user (you) can *write*.
- Never use the `service_role` key in this app or commit it anywhere — it
  bypasses all security rules.
- Only create one admin user unless you specifically want to give someone
  else access — anyone with valid login credentials has full edit rights.
