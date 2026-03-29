import type { SiteContent } from '../content/site-content';
import { galleryMedia, property } from '../data/property';
import {
  getAlternateLinks,
  getOgLocale,
  localizedPath,
  type Locale,
  type PageSlug
} from './i18n';

const placeholderHosts = new Set(['example.com', 'www.example.com']);

export function buildCanonicalUrl(locale: Locale, page: PageSlug) {
  return new URL(localizedPath(locale, page), property.siteUrl).toString();
}

export function buildAlternateUrls(page: PageSlug) {
  return getAlternateLinks(page).map((item) => ({
    ...item,
    href: new URL(item.href, property.siteUrl).toString()
  }));
}

export function hasRealExternalLink(url: string) {
  try {
    return !placeholderHosts.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function buildStructuredData(
  locale: Locale,
  page: PageSlug,
  content: SiteContent
) {
  const canonical = buildCanonicalUrl(locale, page);
  const sameAs = Object.values(property.listingLinks).filter(hasRealExternalLink);
  const images = galleryMedia
    .slice(0, 4)
    .map((item) => new URL(item.src, property.siteUrl).toString());
  const seoKey = page === '' ? 'home' : page;
  const seo = content.seo[seoKey];

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'VacationRental',
      name: property.propertyName,
      description: seo.description,
      url: canonical,
      image: images,
      telephone: property.phoneDisplay,
      email: property.email,
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: property.facts.maxGuests
      },
      numberOfRooms: property.facts.bedrooms,
      amenityFeature: content.accommodation.amenities.items.map((item) => ({
        '@type': 'LocationFeatureSpecification',
        name: item.title,
        value: true
      })),
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.address.locality,
        addressRegion: property.address.region,
        postalCode: property.address.postalCode,
        addressCountry: property.address.countryCode
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.coordinates.latitude,
        longitude: property.coordinates.longitude
      },
      sameAs: sameAs.length > 0 ? sameAs : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonical,
      inLanguage: locale,
      isPartOf: {
        '@type': 'WebSite',
        name: property.siteName,
        url: property.siteUrl
      }
    }
  ];
}

export function getSeoMeta(locale: Locale, content: SiteContent, page: PageSlug) {
  const seoKey = page === '' ? 'home' : page;
  const seo = content.seo[seoKey];
  return {
    title: seo.title,
    description: seo.description,
    canonical: buildCanonicalUrl(locale, page),
    alternates: buildAlternateUrls(page),
    ogLocale: getOgLocale(locale),
    ogImage: new URL(property.socialImage, property.siteUrl).toString()
  };
}
