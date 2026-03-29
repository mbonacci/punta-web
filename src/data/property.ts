import { siteName, siteUrl } from '../../site.settings.mjs';

export type AvailabilityState = 'available' | 'limited' | 'booked' | 'inquiry';

export type GalleryMediaItem = {
  id: string;
  src: string;
  width: number;
  height: number;
  priority?: boolean;
};

export const property = {
  siteName,
  siteUrl,
  propertyName: 'House Punta',
  email: 'stay@house-punta.example',
  phoneDisplay: '+385 91 000 0000',
  phoneE164: '+385910000000',
  whatsappDisplay: '+385 91 000 0000',
  whatsappE164: '+385910000000',
  coordinates: {
    latitude: 43.3298,
    longitude: 16.4462
  },
  address: {
    locality: 'Milna',
    region: 'Split-Dalmatia County',
    postalCode: '21405',
    countryCode: 'HR'
  },
  facts: {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    livingSpaceSqFt: 807.3,
    groundsSqm: 20000,
    beachDistanceMeters: 30
  },
  access: {
    milnaDistanceMiles: 3,
    milnaDriveMinutes: 15,
    parkingDistanceMeters: 40
  },
  amenities: {
    petFriendly: true,
    privateBeach: true,
    jetty: true,
    boatMooring: true,
    barbecue: true,
    garden: true,
    wifi: true,
    roomFans: true,
    satelliteTv: true
  },
  review: {
    score: 10,
    scoreDisplay: '10/10',
    reviewCount: 20
  },
  checkIn: '16:00',
  checkOut: '11:00',
  listingLinks: {
    vrbo: 'https://www.vrbo.com/3724994ha?expediaPropertyId=34014412&regionId=6144551&destType=MARKET&sort=RECOMMENDED',
    airbnb: 'https://example.com/airbnb-house-punta',
    booking: 'https://example.com/booking-house-punta'
  },
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=43.3298,16.4462',
  socialImage: '/images/house-punta-hero.jpg'
} as const;

export const galleryMedia: GalleryMediaItem[] = [
  {
    id: 'hero-coast',
    src: '/images/house-punta-hero.jpg',
    width: 1600,
    height: 900,
    priority: true
  },
  {
    id: 'house-exterior',
    src: '/images/house-punta-garden.jpg',
    width: 1400,
    height: 786
  },
  {
    id: 'terrace-evening',
    src: '/images/house-punta-terrace.jpg',
    width: 1400,
    height: 933
  },
  {
    id: 'living-area',
    src: '/images/house-punta-interior.jpg',
    width: 865,
    height: 1400
  },
  {
    id: 'house-front',
    src: '/images/house-punta-exterior-2.jpg',
    width: 1400,
    height: 786
  }
];

export const galleryMediaById = Object.fromEntries(
  galleryMedia.map((item) => [item.id, item])
) as Record<GalleryMediaItem['id'], GalleryMediaItem>;

export const mockAvailability = [
  { month: '2026-04', state: 'available' },
  { month: '2026-05', state: 'available' },
  { month: '2026-06', state: 'limited' },
  { month: '2026-07', state: 'booked' },
  { month: '2026-08', state: 'limited' },
  { month: '2026-09', state: 'available' },
  { month: '2026-10', state: 'available' },
  { month: '2026-11', state: 'inquiry' },
  { month: '2026-12', state: 'inquiry' }
] as const satisfies ReadonlyArray<{ month: string; state: AvailabilityState }>;
