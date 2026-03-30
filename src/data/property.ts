import { z } from 'zod';
import { siteUrl } from '../../site.settings.mjs';
import availabilityData from '../content/data/availability.json';
import mediaData from '../content/data/media.json';
import propertyData from '../content/data/property.json';

export type AvailabilityState = 'available' | 'limited' | 'booked' | 'inquiry';

const localAssetPathSchema = z.string().startsWith('/');
const optionalLocalAssetPathSchema = z
  .union([localAssetPathSchema, z.null()])
  .optional()
  .transform((value) => value ?? undefined);
const availabilityStateSchema = z.enum(['available', 'limited', 'booked', 'inquiry']);

const propertyDataSchema = z
  .object({
    siteName: z.string(),
    propertyName: z.string(),
    contact: z
      .object({
        email: z.email(),
        phoneDisplay: z.string(),
        phoneE164: z.string(),
        whatsappDisplay: z.string(),
        whatsappE164: z.string()
      })
      .strict(),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number()
      })
      .strict(),
    address: z
      .object({
        locality: z.string(),
        region: z.string(),
        postalCode: z.string(),
        countryCode: z.string()
      })
      .strict(),
    facts: z
      .object({
        bedrooms: z.number(),
        bathrooms: z.number(),
        maxGuests: z.number(),
        livingSpaceSqFt: z.number(),
        groundsSqm: z.number(),
        beachDistanceMeters: z.number()
      })
      .strict(),
    access: z
      .object({
        milnaDistanceMiles: z.number(),
        milnaDriveMinutes: z.number(),
        parkingDistanceMeters: z.number()
      })
      .strict(),
    review: z
      .object({
        score: z.number(),
        scoreDisplay: z.string(),
        reviewCount: z.number()
      })
      .strict(),
    schedule: z
      .object({
        checkIn: z.string(),
        checkOut: z.string()
      })
      .strict(),
    listingLinks: z
      .object({
        vrbo: z.url(),
        airbnb: z.url(),
        booking: z.url()
      })
      .strict(),
    mapDirectionsUrl: z.url()
  })
  .strict();

const imageMediaSchema = z
  .object({
    id: z.string(),
    type: z.literal('image'),
    src: localAssetPathSchema,
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    priority: z.boolean().optional()
  })
  .strict();

const fileVideoSchema = z
  .object({
    id: z.string(),
    type: z.literal('video'),
    source: z.literal('file'),
    src: localAssetPathSchema,
    poster: optionalLocalAssetPathSchema,
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    priority: z.boolean().optional(),
    autoplay: z.boolean().optional(),
    loop: z.boolean().optional(),
    muted: z.boolean().optional()
  })
  .strict();

const embedVideoSchema = z
  .object({
    id: z.string(),
    type: z.literal('video'),
    source: z.literal('embed'),
    embedUrl: z.url(),
    poster: optionalLocalAssetPathSchema,
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    priority: z.boolean().optional()
  })
  .strict();

const galleryMediaSchema = z.union([
  imageMediaSchema,
  fileVideoSchema,
  embedVideoSchema
]);

const pageMediaSlotSchema = z
  .object({
    homeHero: z.string(),
    homeStory: z.string(),
    accommodationHero: z.string(),
    accommodationOverview: z.string(),
    galleryHero: z.string(),
    locationHero: z.string(),
    locationIllustration: z.string()
  })
  .strict();

const mediaDataSchema = z
  .object({
    socialImage: localAssetPathSchema,
    pageMedia: pageMediaSlotSchema,
    gallery: z.array(galleryMediaSchema).min(1)
  })
  .strict();

const availabilityDataSchema = z
  .object({
    source: z.enum(['manual', 'ical']),
    icalFeeds: z
      .object({
        airbnb: z.union([z.literal(''), z.url()]),
        booking: z.union([z.literal(''), z.url()])
      })
      .strict(),
    months: z
      .array(
        z
          .object({
            month: z.string().regex(/^\d{4}-\d{2}$/),
            state: availabilityStateSchema
          })
          .strict()
      )
      .min(1)
  })
  .strict();

const propertyConfig = propertyDataSchema.parse(propertyData);
const mediaConfig = mediaDataSchema.parse(mediaData);
const availabilityConfig = availabilityDataSchema.parse(availabilityData);

export type GalleryMediaItem = z.infer<typeof galleryMediaSchema>;
export type PageMediaSlot = keyof z.infer<typeof pageMediaSlotSchema>;

export const galleryMedia = mediaConfig.gallery;

export const galleryMediaById = Object.fromEntries(
  galleryMedia.map((item) => [item.id, item])
) as Record<GalleryMediaItem['id'], GalleryMediaItem>;

function requireGalleryMedia(id: string) {
  const item = galleryMediaById[id];

  if (!item) {
    throw new Error(`Unknown gallery media id: ${id}`);
  }

  return item;
}

const duplicateGalleryIds = galleryMedia
  .map((item) => item.id)
  .filter((id, index, list) => list.indexOf(id) !== index);

if (duplicateGalleryIds.length > 0) {
  throw new Error(`Duplicate gallery media ids: ${duplicateGalleryIds.join(', ')}`);
}

export const pageMedia = Object.freeze(
  Object.fromEntries(
    Object.entries(mediaConfig.pageMedia).map(([slot, mediaId]) => [
      slot,
      requireGalleryMedia(mediaId)
    ])
  ) as Record<PageMediaSlot, GalleryMediaItem>
);

export const property = Object.freeze({
  siteName: propertyConfig.siteName,
  siteUrl,
  propertyName: propertyConfig.propertyName,
  email: propertyConfig.contact.email,
  phoneDisplay: propertyConfig.contact.phoneDisplay,
  phoneE164: propertyConfig.contact.phoneE164,
  whatsappDisplay: propertyConfig.contact.whatsappDisplay,
  whatsappE164: propertyConfig.contact.whatsappE164,
  coordinates: propertyConfig.coordinates,
  address: propertyConfig.address,
  facts: propertyConfig.facts,
  access: propertyConfig.access,
  review: propertyConfig.review,
  checkIn: propertyConfig.schedule.checkIn,
  checkOut: propertyConfig.schedule.checkOut,
  listingLinks: propertyConfig.listingLinks,
  mapDirectionsUrl: propertyConfig.mapDirectionsUrl,
  socialImage: mediaConfig.socialImage
});

export const availabilitySource = availabilityConfig.source;
export const availabilityFeeds = availabilityConfig.icalFeeds;
export const mockAvailability = availabilityConfig.months;
