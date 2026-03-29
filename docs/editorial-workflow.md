# Editorial Workflow

This project is set up so non-technical edits happen in content files, while GitHub remains the source of truth.

## Recommended setup

1. Connect the repository to CloudCannon.
2. In CloudCannon, set:
   - install command: `npm ci`
   - build command: `npm run build`
   - output directory: `dist`
3. Invite Marija as an editor.
4. Keep editing on branches / pull requests, not directly on `main`.
5. Protect `main` in GitHub so merges require the `Validate` workflow to pass.

## What Marija edits

- Text copy: `src/content/site/*.json`
- Contact details and platform links: `src/content/data/property.json`
- Gallery items and featured page media: `src/content/data/media.json`
- Manual availability: `src/content/data/availability.json`
- Uploaded images: `public/images/`
- Uploaded videos: `public/videos/`
- Default CloudCannon uploads: `public/uploads/`

## Daily workflow

1. Marija edits content in CloudCannon.
2. CloudCannon opens a pull request.
3. GitHub Actions runs validation and build checks.
4. You review and merge.
5. Merge to `main` triggers deployment to cPanel when FTP secrets are configured.

## Editing experience

- Locale files open in the Data Editor with top-level tabs for major sections.
- Property, media, and availability files open as tabbed data forms instead of raw JSON.
- Gallery media uses card-style array editing with templates for image, local video, and embedded video items.
- File uploads from CloudCannon go to `public/uploads/` by default unless moved manually later.

## Translation rule

Croatian (`hr`) is the source locale. When structure changes in Croatian, the other locale files must be updated in the same pull request.

## Media rule

- Keep original photo and video masters outside Git.
- Only commit optimized web-ready files.
- Keep captions in sync with media ids across all locale files.
