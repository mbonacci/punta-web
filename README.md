# House Punta

Production-ready Astro website for a private family-owned rental house near Milna on the island of Brac, Croatia.

The site is static, multilingual from day one, and organized so non-technical content edits can happen without touching layout code.

## Stack

- Astro 6
- Static output
- Custom CSS only
- Locale JSON files for all user-facing copy
- Structured JSON data for property details, media, and availability
- GitHub Actions for validation and optional cPanel deployment

## Local development

Requirements:

- Node.js 22+
- npm 10+

Commands:

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

`npm run check` now validates both:

- locale/content structure
- media references and captions
- Astro type/build checks

## Project structure

Key files and folders:

- `src/pages/[locale]/`
  Localized routes for all required pages.
- `src/content/site/*.json`
  Locale copy for `hr`, `en`, `de`, `fr`, and `es`.
- `src/content/data/property.json`
  Contact details, coordinates, guest facts, review summary, check-in/out, and listing links.
- `src/content/data/media.json`
  Gallery items plus page-level featured media selections.
- `src/content/data/availability.json`
  Manual availability source with future iCal placeholders.
- `src/content/site-content.ts`
  Typed loader and validation for locale JSON content.
- `src/data/property.ts`
  Typed loader and shared helpers for structured site data.
- `src/lib/inquiry.ts`
  Inquiry adapter abstraction and direct-contact fallback helpers.
- `src/lib/availability.ts`
  Mock availability provider and the future iCal integration hook.
- `public/images/`
  Replaceable image assets.
- `public/videos/`
  Optional web-ready video assets.
- `.github/workflows/ci.yml`
  Pull request and branch validation.
- `.github/workflows/deploy-cpanel.yml`
  Automatic deploy to cPanel after merge to `main` when FTP secrets are configured.
- `cloudcannon.config.yml`
  Basic repository hints for CloudCannon editing.

## Supported locales

Implemented locales:

- `hr`
- `en`
- `de`
- `fr`
- `es`

Routing pattern:

- `/hr/`
- `/en/`
- `/de/`
- `/fr/`
- `/es/`

The root URL `/` redirects to `/hr/`.

## Content maintenance

### Edit text

All user-facing text lives in:

- `src/content/site/hr.json`
- `src/content/site/en.json`
- `src/content/site/de.json`
- `src/content/site/fr.json`
- `src/content/site/es.json`

Croatian is the source version. Keep the same structure across all locale files and update all locales in the same pull request when fields are added, removed, or reordered.

### Edit contact info, guest facts, and listing links

Update:

- `src/content/data/property.json`

This file contains:

- email
- phone
- WhatsApp number
- coordinates
- locality metadata
- check-in / check-out
- Airbnb / Booking / VRBO links
- guest / room / sea-distance facts

### Edit gallery items and featured media

Update:

- `src/content/data/media.json`

This file contains:

- the gallery media list
- the social share image path
- which media item appears in the home hero
- which media item appears on accommodation, gallery, and location pages

Captions stay in locale files under `galleryCaptions`.

### Replace images

Put optimized files in:

- `public/images/`

CloudCannon uploads files to:

- `public/uploads/`

Then either:

1. keep the same filenames for zero content changes, or
2. update `src/content/data/media.json` if filenames change.

### Add videos

Put optimized web-ready files in:

- `public/videos/`

CloudCannon uploads files to:

- `public/uploads/`

Then add a new media item in:

- `src/content/data/media.json`

Supported approaches:

- local video file, for example `/videos/terrace-walkthrough.mp4`
- external embed URL, for example a YouTube or Vimeo embed URL

Keep original masters outside Git. Only commit compressed files intended for the website.

### Edit availability

Update:

- `src/content/data/availability.json`

Current behavior:

- manual month-by-month statuses rendered statically

Future behavior:

- switch the provider to iCal-backed availability without changing page markup

### Edit site URL

Update:

- `site.settings.mjs`
- `public/robots.txt`

Then rebuild so canonical URLs, sitemap output, and OG URLs use the final domain.

## Editorial workflow for Marija

Recommended setup:

1. Connect this GitHub repo to CloudCannon.
2. In CloudCannon, configure:
   - install command: `npm ci`
   - build command: `npm run build`
   - output directory: `dist`
3. Invite Marija as an editor.
4. Keep `main` protected in GitHub.
5. Require pull requests and the `Validate` workflow before merge.

Recommended day-to-day flow:

1. Marija edits content in CloudCannon.
2. CloudCannon creates a branch or pull request.
3. GitHub Actions runs validation.
4. You review and merge.
5. Merge to `main` deploys automatically to cPanel once FTP secrets are configured.

Detailed notes:

- `docs/editorial-workflow.md`

## GitHub and deployment setup

### Branch protection

In GitHub, protect `main` and require:

- pull requests
- at least one review
- passing status check: `Validate`
- code owner review if you want `CODEOWNERS` to apply

### Automatic cPanel deployment

The repository already includes:

- `.github/workflows/deploy-cpanel.yml`

Add these GitHub repository secrets before expecting automatic deployment:

- `CPANEL_FTP_SERVER`
- `CPANEL_FTP_USERNAME`
- `CPANEL_FTP_PASSWORD`
- `CPANEL_FTP_SERVER_DIR`

Typical `CPANEL_FTP_SERVER_DIR` value:

- `/public_html/`

Once the secrets are present, every push to `main` rebuilds and uploads `dist/` to cPanel.

## Availability and inquiry extension points

### Future iCal sync

Start here:

- `src/lib/availability.ts`
- `src/content/data/availability.json`

Recommended future direction:

1. store Airbnb and Booking.com iCal URLs in `src/content/data/availability.json`
2. fetch calendars at build time
3. normalize bookings into display data
4. replace the manual provider with an iCal-backed provider

### Future form backend wiring

Start here:

- `src/lib/inquiry.ts`
- `src/components/InquiryForm.astro`

Current behavior:

- validated frontend form UI
- direct-contact fallback via email and WhatsApp
- no live backend submission yet

You can connect this later to:

- FormSubmit-style service
- custom API endpoint
- PHP mail handler on cPanel
- third-party form backend

## SEO and deployment notes

Implemented:

- per-page titles and descriptions
- canonical links
- locale alternate links
- Open Graph tags
- Twitter card tags
- JSON-LD for `VacationRental` and `WebPage`
- sitemap generation
- robots file
- semantic HTML

Build output:

- `dist/`

## Deploy to cPanel manually

Typical manual deployment flow:

1. Run `npm run build`.
2. Open `dist/`.
3. Upload the contents of `dist/` into your cPanel `public_html/` directory.
4. Make sure hidden files are included so `.htaccess` is uploaded.
5. Confirm the live domain serves `/` and redirects to `/hr/`.
6. Confirm `robots.txt` and the sitemap URLs are reachable on the live domain.

## Verification completed

This project should be verified with:

- `npm run check`
- `npm run build`

## Manual TODO

- Replace placeholder domain in `site.settings.mjs` and `public/robots.txt`.
- Replace placeholder contact details in `src/content/data/property.json`.
- Replace placeholder Airbnb and Booking.com links in `src/content/data/property.json`.
- Connect the repo to CloudCannon and invite Marija as an editor.
- Configure GitHub branch protection for `main`.
- Add cPanel FTP secrets in GitHub to enable automatic deployment.
- Replace the imported JPGs in `public/images/` with final owner photography.
- Add final web-ready videos to `public/videos/` if you want motion in the gallery.
- Review and finalize Croatian copy, then update the other locales.
- Insert the final legal identity of the rental operator in the privacy policy files.
- Decide the real form delivery backend and wire the inquiry adapter.
- Implement iCal sync when platform calendar URLs are available.
