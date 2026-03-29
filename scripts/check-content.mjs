import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const localeIds = ['hr', 'en', 'de', 'fr', 'es'];
const errors = [];

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(projectRoot, relativePath), 'utf8')
  );
}

function formatPath(trail) {
  if (trail.length === 0) {
    return '(root)';
  }

  return trail
    .map((segment, index) =>
      typeof segment === 'number'
        ? `[${segment}]`
        : index === 0
          ? segment
          : `.${segment}`
    )
    .join('');
}

function compareShape(baseValue, candidateValue, trail, locale) {
  const pathLabel = `${locale}:${formatPath(trail)}`;

  if (Array.isArray(baseValue)) {
    if (!Array.isArray(candidateValue)) {
      errors.push(`${pathLabel} should be an array.`);
      return;
    }

    if (baseValue.length !== candidateValue.length) {
      errors.push(
        `${pathLabel} has ${candidateValue.length} entries, expected ${baseValue.length}.`
      );
    }

    for (let index = 0; index < Math.min(baseValue.length, candidateValue.length); index += 1) {
      compareShape(baseValue[index], candidateValue[index], [...trail, index], locale);
    }

    return;
  }

  if (baseValue && typeof baseValue === 'object') {
    if (!candidateValue || typeof candidateValue !== 'object' || Array.isArray(candidateValue)) {
      errors.push(`${pathLabel} should be an object.`);
      return;
    }

    const baseKeys = Object.keys(baseValue).sort();
    const candidateKeys = Object.keys(candidateValue).sort();

    for (const key of baseKeys) {
      if (!(key in candidateValue)) {
        errors.push(`${pathLabel} is missing key "${key}".`);
      }
    }

    for (const key of candidateKeys) {
      if (!(key in baseValue)) {
        errors.push(`${pathLabel} has unexpected key "${key}".`);
      }
    }

    for (const key of baseKeys) {
      if (key in candidateValue) {
        compareShape(baseValue[key], candidateValue[key], [...trail, key], locale);
      }
    }

    return;
  }

  if (typeof baseValue !== typeof candidateValue) {
    errors.push(
      `${pathLabel} should be ${typeof baseValue}, received ${typeof candidateValue}.`
    );
  }
}

function resolvePublicAsset(webPath) {
  return path.join(projectRoot, 'public', webPath.replace(/^\//, ''));
}

function ensureAssetExists(webPath, context) {
  if (!webPath.startsWith('/')) {
    errors.push(`${context} must start with "/": ${webPath}`);
    return;
  }

  if (!fs.existsSync(resolvePublicAsset(webPath))) {
    errors.push(`${context} points to a missing file: ${webPath}`);
  }
}

const baseLocaleContent = readJson('src/content/site/hr.json');

for (const locale of localeIds) {
  const localizedContent = readJson(`src/content/site/${locale}.json`);
  compareShape(baseLocaleContent, localizedContent, [], locale);
}

const media = readJson('src/content/data/media.json');
const galleryIds = new Set();

for (const item of media.gallery) {
  if (galleryIds.has(item.id)) {
    errors.push(`media.gallery contains duplicate id "${item.id}".`);
  }

  galleryIds.add(item.id);

  if (item.type === 'image' || item.source === 'file') {
    ensureAssetExists(item.src, `media.gallery["${item.id}"].src`);
  }

  if (item.poster) {
    ensureAssetExists(item.poster, `media.gallery["${item.id}"].poster`);
  }
}

ensureAssetExists(media.socialImage, 'media.socialImage');

for (const [slot, mediaId] of Object.entries(media.pageMedia)) {
  if (!galleryIds.has(mediaId)) {
    errors.push(`media.pageMedia.${slot} references missing media id "${mediaId}".`);
  }
}

for (const locale of localeIds) {
  const localizedContent = readJson(`src/content/site/${locale}.json`);
  const captionIds = new Set(Object.keys(localizedContent.galleryCaptions ?? {}));

  for (const id of galleryIds) {
    if (!captionIds.has(id)) {
      errors.push(`${locale}:galleryCaptions is missing caption for "${id}".`);
    }
  }

  for (const captionId of captionIds) {
    if (!galleryIds.has(captionId)) {
      errors.push(`${locale}:galleryCaptions has unused caption "${captionId}".`);
    }
  }
}

const availability = readJson('src/content/data/availability.json');
const seenMonths = new Set();

for (const entry of availability.months) {
  if (!/^\d{4}-\d{2}$/.test(entry.month)) {
    errors.push(`availability.months contains invalid month "${entry.month}".`);
  }

  if (seenMonths.has(entry.month)) {
    errors.push(`availability.months contains duplicate month "${entry.month}".`);
  }

  seenMonths.add(entry.month);
}

if (
  availability.source === 'ical' &&
  !availability.icalFeeds.airbnb &&
  !availability.icalFeeds.booking
) {
  errors.push('availability.source is "ical" but no iCal feed URLs are configured.');
}

if (errors.length > 0) {
  console.error('Content validation failed:\n');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `Content validation passed for ${localeIds.length} locales, ${media.gallery.length} media items, and ${availability.months.length} availability entries.`
);
