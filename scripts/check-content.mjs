import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const localeIds = ["hr", "en", "de", "fr", "es"];
const errors = [];
const optionalAtmosphereKeys = new Set([
  "embedUrl",
  "src",
  "poster",
  "autoplay",
  "loop",
  "muted",
]);

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(projectRoot, relativePath), "utf8"),
  );
}

function formatPath(trail) {
  if (trail.length === 0) {
    return "(root)";
  }

  return trail
    .map((segment, index) =>
      typeof segment === "number"
        ? `[${segment}]`
        : index === 0
          ? segment
          : `.${segment}`,
    )
    .join("");
}

function isGalleryCaptionsPath(trail) {
  return trail.length === 1 && trail[0] === "galleryCaptions";
}

function isAtmosphereItemPath(trail) {
  return (
    trail.length === 4 &&
    trail[0] === "gallery" &&
    trail[1] === "atmosphere" &&
    trail[2] === "items" &&
    typeof trail[3] === "number"
  );
}

function isAtmosphereOptionalFieldPath(trail) {
  return (
    trail.length === 5 &&
    isAtmosphereItemPath(trail.slice(0, -1)) &&
    optionalAtmosphereKeys.has(trail.at(-1))
  );
}

function compareShape(baseValue, candidateValue, trail, locale) {
  const pathLabel = `${locale}:${formatPath(trail)}`;

  if (isAtmosphereOptionalFieldPath(trail)) {
    const fieldName = trail.at(-1);

    if (
      ["embedUrl", "src", "poster"].includes(fieldName) &&
      (baseValue == null || typeof baseValue === "string") &&
      (candidateValue == null || typeof candidateValue === "string")
    ) {
      return;
    }

    if (
      ["autoplay", "loop", "muted"].includes(fieldName) &&
      (baseValue === undefined || typeof baseValue === "boolean") &&
      (candidateValue === undefined || typeof candidateValue === "boolean")
    ) {
      return;
    }
  }

  if (Array.isArray(baseValue)) {
    if (!Array.isArray(candidateValue)) {
      errors.push(`${pathLabel} should be an array.`);
      return;
    }

    if (baseValue.length !== candidateValue.length) {
      errors.push(
        `${pathLabel} has ${candidateValue.length} entries, expected ${baseValue.length}.`,
      );
    }

    for (
      let index = 0;
      index < Math.min(baseValue.length, candidateValue.length);
      index += 1
    ) {
      compareShape(
        baseValue[index],
        candidateValue[index],
        [...trail, index],
        locale,
      );
    }

    return;
  }

  if (baseValue && typeof baseValue === "object") {
    if (
      !candidateValue ||
      typeof candidateValue !== "object" ||
      Array.isArray(candidateValue)
    ) {
      errors.push(`${pathLabel} should be an object.`);
      return;
    }

    if (isGalleryCaptionsPath(trail)) {
      for (const [captionId, caption] of Object.entries(candidateValue)) {
        if (typeof caption !== "string") {
          errors.push(
            `${pathLabel}.${captionId} should be string, received ${typeof caption}.`,
          );
        }
      }

      return;
    }

    const baseKeys = Object.keys(baseValue).sort();
    const candidateKeys = Object.keys(candidateValue).sort();
    const requiredBaseKeys = isAtmosphereItemPath(trail)
      ? baseKeys.filter((key) => !optionalAtmosphereKeys.has(key))
      : baseKeys;

    for (const key of requiredBaseKeys) {
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
        compareShape(
          baseValue[key],
          candidateValue[key],
          [...trail, key],
          locale,
        );
      }
    }

    return;
  }

  if (typeof baseValue !== typeof candidateValue) {
    errors.push(
      `${pathLabel} should be ${typeof baseValue}, received ${typeof candidateValue}.`,
    );
  }
}

function resolvePublicAsset(webPath) {
  return path.join(projectRoot, "public", webPath.replace(/^\//, ""));
}

function ensureAssetExists(webPath, context) {
  if (!webPath.startsWith("/")) {
    errors.push(`${context} must start with "/": ${webPath}`);
    return;
  }

  if (!fs.existsSync(resolvePublicAsset(webPath))) {
    errors.push(`${context} points to a missing file: ${webPath}`);
  }
}

const baseLocaleContent = readJson("src/content/site/hr.json");

for (const locale of localeIds) {
  const localizedContent = readJson(`src/content/site/${locale}.json`);
  compareShape(baseLocaleContent, localizedContent, [], locale);

  const atmosphereItems = localizedContent.gallery?.atmosphere?.items ?? [];

  for (let index = 0; index < atmosphereItems.length; index += 1) {
    const item = atmosphereItems[index];
    const hasEmbed =
      typeof item.embedUrl === "string" && item.embedUrl.length > 0;
    const hasSrc = typeof item.src === "string" && item.src.length > 0;

    if (hasEmbed === hasSrc) {
      errors.push(
        `${locale}:gallery.atmosphere.items[${index}] must define exactly one of embedUrl or src.`,
      );
    }

    if (hasSrc) {
      ensureAssetExists(
        item.src,
        `${locale}:gallery.atmosphere.items[${index}].src`,
      );
    }

    if (typeof item.poster === "string" && item.poster.length > 0) {
      ensureAssetExists(
        item.poster,
        `${locale}:gallery.atmosphere.items[${index}].poster`,
      );
    }
  }
}

const media = readJson("src/content/data/media.json");
const galleryIds = new Set();

for (const item of media.gallery) {
  if (galleryIds.has(item.id)) {
    errors.push(`media.gallery contains duplicate id "${item.id}".`);
  }

  galleryIds.add(item.id);

  if (item.type === "image" || item.source === "file") {
    ensureAssetExists(item.src, `media.gallery["${item.id}"].src`);
  }

  if (item.poster) {
    ensureAssetExists(item.poster, `media.gallery["${item.id}"].poster`);
  }
}

ensureAssetExists(media.socialImage, "media.socialImage");

for (const [slot, mediaId] of Object.entries(media.pageMedia)) {
  if (!galleryIds.has(mediaId)) {
    errors.push(
      `media.pageMedia.${slot} references missing media id "${mediaId}".`,
    );
  }
}

for (const locale of localeIds) {
  const localizedContent = readJson(`src/content/site/${locale}.json`);
  const captionIds = new Set(
    Object.keys(localizedContent.galleryCaptions ?? {}),
  );

  if (locale === "hr") {
    for (const id of galleryIds) {
      if (!captionIds.has(id)) {
        errors.push(
          `${locale}:galleryCaptions is missing caption for "${id}".`,
        );
      }
    }
  }

  for (const captionId of captionIds) {
    if (!galleryIds.has(captionId)) {
      errors.push(
        `${locale}:galleryCaptions has unused caption "${captionId}".`,
      );
    }
  }
}

const availability = readJson("src/content/data/availability.json");
const seenMonths = new Set();

for (const entry of availability.months) {
  if (!/^\d{4}-\d{2}$/.test(entry.month)) {
    errors.push(`availability.months contains invalid month "${entry.month}".`);
  }

  if (seenMonths.has(entry.month)) {
    errors.push(
      `availability.months contains duplicate month "${entry.month}".`,
    );
  }

  seenMonths.add(entry.month);
}

if (
  availability.source === "ical" &&
  !availability.icalFeeds.airbnb &&
  !availability.icalFeeds.booking
) {
  errors.push(
    'availability.source is "ical" but no iCal feed URLs are configured.',
  );
}

if (errors.length > 0) {
  console.error("Content validation failed:\n");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `Content validation passed for ${localeIds.length} locales, ${media.gallery.length} media items, and ${availability.months.length} availability entries.`,
);
