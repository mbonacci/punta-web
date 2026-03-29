# Project: House Punta Rental Website

Build a production-ready multilingual website for a private family-owned rental house on the island of Brač, Croatia.

## Business context
- This is a real family house used for seasonal tourist rental.
- The house is on siland of Brač (near Milna), near the beach (about 100 meters), secluded, quiet, and positioned as Robinson-style tourism.
- Selling points are privacy, sea, nature, peace, authenticity, and direct coastal experience.
- The site should help drive direct inquiries and also support credibility when linked from Airbnb, Booking.com, and other listing platforms.
- Time is important: the first usable version should be built quickly.

## Primary goal
Create a fast, elegant, mobile-first, SEO-friendly website that presents the property professionally and allows visitors to:
- understand the accommodation quickly
- view photos and videos
- check availability
- send an inquiry
- contact via WhatsApp

## Secondary goal
Make the project easy to update and extend later with:
- final images
- final multilingual content
- iCal availability sync
- listing platform links
- optional booking workflow

## Technical requirements
- Use Astro.
- Prefer a static site architecture.
- Output must be deployable to standard cPanel hosting.
- Minimize dependencies.
- Avoid unnecessary complexity and avoid heavy runtime requirements.
- Keep code simple, readable, and maintainable.
- Separate content from presentation.

## Required pages
- Home
- Accommodation / About the house
- Gallery
- Location
- Availability
- Contact / Inquiry
- Privacy Policy
- Optional: Getting Here / FAQ if useful

## Required features
- Responsive mobile-first design
- Strong CTA above the fold
- Sticky mobile CTA for WhatsApp and inquiry
- SEO metadata on every page
- Open Graph / social share metadata
- Structured data for vacation rental / lodging where appropriate
- Fast image handling with clear content replacement workflow
- Inquiry/contact form UI with a clean abstraction for backend wiring
- Availability calendar page with a simple mock implementation and clear extension point for iCal sync
- Language switcher
- Multilingual routing and content structure
- Clean placeholder content where final content is missing
- Easy replacement of text, images, pricing, and contact details

## Languages
The site must be structured for these locales:
- hr
- en
- de
- fr
- es

Do not hardcode text directly into components except for tiny UI fallback labels if unavoidable.

All user-facing text should come from locale content files.

## Content architecture
Use a structured content approach such as:
- src/content/site/hr.json
- src/content/site/en.json
- src/content/site/de.json
- src/content/site/fr.json
- src/content/site/es.json

Or an equivalent typed structure.

The structure should support:
- site-wide metadata
- navigation labels
- homepage sections
- amenities/features
- house details
- gallery captions
- location text
- availability text
- contact text
- SEO text

The Croatian file can be treated as the base source.
Other languages may initially contain AI-generated placeholder translations, but clearly separate content from code.

## Design direction
- Mediterranean / Adriatic feel
- Clean and premium, but not corporate luxury-hotel style
- Large hero image
- Calm typography
- Warm, airy layout
- Clear sections and strong imagery
- No clutter
- Avoid template-like visual noise

## UX priorities
- Immediate emotional impression from hero section
- Fast understanding of what is being offered
- Visible trust signals
- Very easy inquiry flow
- Easy browsing on mobile
- Simple language switching

## Availability approach
- Do not build a full booking engine.
- Implement a clean availability page with:
  - a mocked calendar or simple availability status UI
  - clear abstraction/interface for later iCal sync from Airbnb/Booking.com
- Add documentation comments or README notes for future iCal integration.

## Form handling
- Build a clean inquiry form UI and validation.
- Abstract submission logic so it can later be connected to:
  - formsubmit-style service
  - custom endpoint
  - PHP mail on hosting
  - third-party form backend
- Do not overengineer backend handling in v1.

## Images and media
- Create a clear folder strategy for images.
- Use optimized responsive images where practical.
- Document where final images should be placed.
- Make gallery content easy to update.
- Allow for optional future video section without forcing it now.

## SEO requirements
- Per-page title and description
- Canonical support
- Open Graph tags
- Language-aware metadata where applicable
- Structured data
- Sitemap support
- Robots support
- Internal linking
- Semantic HTML

## Deliverables
The implementation is complete only when all of the following exist:
1. A working Astro project
2. All required pages implemented
3. Working navigation
4. Multilingual structure for hr/en/de/fr/es
5. Language switcher
6. Content separated from layout
7. Responsive design across main breakpoints
8. SEO basics implemented
9. Availability page implemented with future iCal extension point
10. Inquiry page/form implemented
11. README with:
   - how to run locally
   - how to build
   - how to deploy to cPanel
   - how to replace content
   - how to replace images
   - where to edit contact info
   - where to add Airbnb/Booking links
   - where to later implement iCal sync
12. A concise TODO list for manual follow-up

## Implementation behavior
- Do not stop after scaffolding.
- Do not just outline options.
- Actually implement the full v1 site.
- Make grounded technical decisions and proceed.
- If some detail is missing, use tasteful placeholder content and note it clearly.
- Prioritize completion over unnecessary abstraction.