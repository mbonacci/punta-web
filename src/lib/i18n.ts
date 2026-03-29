export const supportedLocales = ['hr', 'en', 'de', 'fr', 'es'] as const;
export const defaultLocale = 'hr';

export type Locale = (typeof supportedLocales)[number];
export type PageSlug =
  | ''
  | 'accommodation'
  | 'gallery'
  | 'location'
  | 'availability'
  | 'contact'
  | 'privacy';

const ogLocaleMap: Record<Locale, string> = {
  hr: 'hr_HR',
  en: 'en_GB',
  de: 'de_DE',
  fr: 'fr_FR',
  es: 'es_ES'
};

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function getStaticLocalePaths() {
  return supportedLocales.map((locale) => ({ params: { locale } }));
}

export function localizedPath(locale: Locale, slug: PageSlug = '') {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

export function getAlternateLinks(slug: PageSlug = '') {
  return supportedLocales.map((locale) => ({
    hrefLang: locale,
    href: localizedPath(locale, slug)
  }));
}

export function getOgLocale(locale: Locale) {
  return ogLocaleMap[locale];
}
