# Ankvidhya website — production setup

## Install and run

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

## Environment

Create `.env.local` from `.env.example` and supply the project's existing Supabase URL and publishable key. Do not commit `.env.local` or any Supabase service-role key.

Set `VITE_SITE_URL` to the single canonical website host. The current default is `https://ankvidhya.com`; if the preferred canonical host is `https://www.ankvidhya.com`, change the environment value and align `public/robots.txt` and `public/sitemap.xml` with that host, then redirect the alternate host to it.

Add the verified official Instagram and YouTube URLs through `VITE_INSTAGRAM_URL` and `VITE_YOUTUBE_URL`. Leave them blank until confirmed.

## Images

The public image files are extracted from the supplied Ankvidhya brochures and optimized as WebP. The classroom image `school-classroom-illustrative.webp` is AI-generated and is labelled as illustrative; it is not documentation of an actual Ankvidhya school. The center building image is an illustration, not a photograph of the Surat office.

`src/data/siteImages.js` is the central image manifest. `src/components/ResponsiveImage.jsx` adds intrinsic dimensions, lazy loading and priority loading for hero images.

## Public website and data

The six public routes are Home, School Partnership, Center / Franchise, Online Courses, Founder and Contact. Public course cards are read from `courses` and `course_categories` according to the published/active flags and delivery mode. Public enquiry forms insert into `leads`; staff-only records remain behind Supabase RLS.

## Release checks still required

1. Confirm canonical host and production DNS / TLS.
2. Confirm the published course records, delivery modes, prices, course covers and syllabus before announcing online availability.
3. Verify all Supabase RLS policies against the production project. The browser must use only the public publishable key; never put a service-role key in Vite environment variables.
4. Add server-verified bot protection and rate limiting for public lead submissions (for example Cloudflare Turnstile verified in a Supabase Edge Function). The current client-side honeypot is only a basic deterrent and is not a complete anti-spam control.
5. Publish reviewed Privacy Policy and Terms pages and link them from the footer and enquiry consent text.
6. Verify all contact details, social URLs, impact figures, awards and franchise commercial terms with the business owner before release.
7. Test all public forms, course foreign-key association, WhatsApp, phone, email, Google Maps and mobile navigation on the deployed domain.
8. Run `npm ci`, `npm run lint`, `npm run build` and smoke-test the Vercel deployment.

## Admin scope

Admin authentication and the dashboard shell are present. Course/CRM/content-management routes still include placeholder modules in this project and should not be considered a finished production back office.
