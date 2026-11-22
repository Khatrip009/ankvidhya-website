# Ankvidhya Website

Responsive React + Vite website for Ankvidhya, using Tailwind CSS v4, React Router and Supabase.

## Public pages

- `/` — Home
- `/school-partnership` — School partnership program and inquiry form
- `/center` — Center / franchise opportunity and inquiry form
- `/online-courses` — Published online courses and course enquiry
- `/founder` — Founder profile
- `/contact` — Contact details, map and general inquiry form

## Local development

1. Install Node.js (use a version compatible with the Vite version in `package.json`).
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SITE_URL`.
4. Run:

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
npm run preview
```

## Production notes

Read [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md) before deployment. In particular, confirm the canonical domain, public course records, Supabase RLS, verified bot protection, privacy/legal pages, and contact details.

Do not commit `.env.local`, service-role keys, database passwords or other secrets. The browser must use only the Supabase publishable key.
