# House Punta

Production-ready Astro v1 website for a private family-owned rental house near Milna on the island of Brac, Croatia.

The site is static, multilingual from day one, and designed for direct inquiries plus credibility links from Airbnb, Booking.com, and similar platforms.

## Stack

- Astro 6
- Static output
- Custom CSS only
- Locale JSON files for all user-facing copy
- Simple mock availability layer with a documented future iCal extension point

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

## Project structure

Key files and folders:

- `src/pages/[locale]/`  
  Localized routes for all required pages.
- `src/content/site/*.json`  
  Locale content files for `hr`, `en`, `de`, `fr`, and `es`.
- `src/content/site-content.ts`  
  Typed loader and validation for locale JSON content.
- `src/data/property.ts`  
  Contact data, coordinates, property facts, gallery file references, listing links, and mock availability.
- `src/lib/i18n.ts`  
  Supported locales, route helpers, and alternate-link generation.
- `src/lib/inquiry.ts`  
  Inquiry adapter abstraction and direct-contact fallback helpers.
- `src/lib/availability.ts`  
  Mock availability provider and the future iCal integration hook.
- `src/layouts/BaseLayout.astro`  
  SEO, Open Graph, JSON-LD, header, footer, and sticky CTA shell.
- `public/images/`  
  Replaceable image assets.
- `public/.htaccess`  
  Apache root redirect to `/hr/` for cPanel deployments.

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

Croatian is the source version. Keep the same object shape across all locale files.

### Edit contact info

Update:

- `src/data/property.ts`

This file contains:

- email
- phone
- WhatsApp number
- coordinates
- locality metadata
- check-in / check-out
- listing links
- guest / room / sea-distance facts

### Edit site URL

Update:

- `site.settings.mjs`
- `public/robots.txt`

Then rebuild so canonical URLs, sitemap output, and OG URLs use the final domain.

### Replace images

Current images are locally stored JPGs imported from the legacy VRBO listing in:

- `public/images/`

To replace them:

1. Keep the same filenames if you want zero code changes.
2. If you rename files, update `galleryMedia` in `src/data/property.ts`.
3. Update captions in each locale file under `galleryCaptions`.

Current image set:

- `house-punta-hero.jpg`
- `house-punta-garden.jpg`
- `house-punta-terrace.jpg`
- `house-punta-interior.jpg`
- `house-punta-exterior-2.jpg`

### Add Airbnb / Booking.com links

Update:

- `src/data/property.ts`

Replace the placeholder `example.com` URLs in `listingLinks`. Once real links are present, they will automatically appear in structured data and the footer.

## Availability and inquiry extension points

### Future iCal sync

Start here:

- `src/lib/availability.ts`

Current behavior:

- manual mock month statuses rendered statically

Recommended future direction:

1. Fetch Airbnb and Booking.com iCal feeds at build time.
2. Normalize booking events into monthly or daily availability.
3. Swap the mock provider for an iCal-backed provider without changing page markup.

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

Static assets to deploy:

- locale folders
- `_astro/`
- `images/`
- `.htaccess`
- `robots.txt`
- `sitemap-index.xml`
- `sitemap-0.xml`
- `favicon.svg`
- `index.html`

## Deploy to cPanel

Typical deployment flow:

1. Run `npm run build`.
2. Open `dist/`.
3. Upload the contents of `dist/` into your cPanel `public_html/` directory.
4. Make sure hidden files are included so `.htaccess` is uploaded.
5. Confirm the live domain serves `/` and redirects to `/hr/`.
6. Confirm `robots.txt` and the sitemap URLs are reachable on the live domain.

## Verification completed

Completed locally:

- `npm run check`
- `npm run build`

Also verified from the build output:

- root redirect page exists
- localized pages were generated for all locales
- sitemap files were created
- `.htaccess`, `robots.txt`, imported gallery images, and compiled CSS were copied to `dist/`
- canonical, hreflang, OG, and JSON-LD are present in built HTML

## Manual TODO

- Replace placeholder domain in `site.settings.mjs` and `public/robots.txt`.
- Replace placeholder contact details in `src/data/property.ts`.
- Replace placeholder Airbnb and Booking.com links in `src/data/property.ts`.
- Replace the imported VRBO JPGs in `public/images/` with final owner photography when available.
- Review and finalize Croatian copy, then refine all translations.
- Insert the final legal identity of the rental operator in the privacy policy files.
- Decide the real form delivery backend and wire the inquiry adapter.
- Implement iCal sync when platform calendar URLs are available.
