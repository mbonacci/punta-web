import { z } from 'zod';
import de from './site/de.json';
import en from './site/en.json';
import es from './site/es.json';
import fr from './site/fr.json';
import hr from './site/hr.json';
import { supportedLocales, type Locale } from '../lib/i18n';

const seoEntrySchema = z.object({
  title: z.string(),
  description: z.string()
});

const heroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string()
});

const heroWithActionsSchema = heroSchema.extend({
  primaryCta: z.string(),
  secondaryCta: z.string(),
  badges: z.array(z.string())
});

const cardSchema = z.object({
  title: z.string(),
  text: z.string()
});

const localAssetPathSchema = z.string().startsWith('/');

const optionalLocalAssetPathSchema = z
  .union([localAssetPathSchema, z.literal(''), z.null()])
  .optional()
  .transform((value) =>
    typeof value === 'string' && value.length > 0 ? value : undefined
  );

const optionalVideoFilePathSchema = z
  .union([localAssetPathSchema, z.literal(''), z.null()])
  .optional()
  .transform((value) =>
    typeof value === 'string' && value.length > 0 ? value : undefined
  );

const optionalVideoEmbedSchema = z
  .union([z.url(), z.literal(''), z.null()])
  .optional()
  .transform((value) =>
    typeof value === 'string' && value.length > 0 ? value : undefined
  );

const videoCardSchema = z
  .object({
    title: z.string(),
    text: z.string(),
    embedUrl: optionalVideoEmbedSchema,
    src: optionalVideoFilePathSchema,
    poster: optionalLocalAssetPathSchema,
    autoplay: z.boolean().optional(),
    loop: z.boolean().optional(),
    muted: z.boolean().optional()
  })
  .strict()
  .superRefine((value, ctx) => {
    const hasEmbed = Boolean(value.embedUrl);
    const hasSrc = Boolean(value.src);

    if (hasEmbed === hasSrc) {
      ctx.addIssue({
        code: 'custom',
        message: 'Each atmosphere video needs exactly one source: embedUrl or src.'
      });
    }
  });

const labelValueSchema = z.object({
  label: z.string(),
  value: z.string()
});

export const siteContentSchema = z.object({
  locale: z.enum(supportedLocales),
  languageLabel: z.string(),
  metadata: z.object({
    siteTitle: z.string(),
    siteDescription: z.string(),
    ogAlt: z.string(),
    announcement: z.string()
  }),
  navigation: z.object({
    home: z.string(),
    accommodation: z.string(),
    gallery: z.string(),
    location: z.string(),
    availability: z.string(),
    contact: z.string(),
    privacy: z.string()
  }),
  common: z.object({
    primaryCta: z.string(),
    secondaryCta: z.string(),
    viewGallery: z.string(),
    viewAvailability: z.string(),
    viewLocation: z.string(),
    viewAccommodation: z.string(),
    readMore: z.string(),
    directInquiry: z.string(),
    priceOnRequest: z.string(),
    season: z.string(),
    placeholderNotice: z.string(),
    statLabels: z.object({
      guests: z.string(),
      bedrooms: z.string(),
      bathrooms: z.string(),
      size: z.string(),
      grounds: z.string(),
      beachDistance: z.string()
    }),
    contactLabels: z.object({
      whatsapp: z.string(),
      email: z.string(),
      phone: z.string()
    }),
    listingLabels: z.object({
      vrbo: z.string(),
      airbnb: z.string(),
      booking: z.string()
    }),
    scheduleLabels: z.object({
      checkIn: z.string(),
      checkOut: z.string()
    })
  }),
  footer: z.object({
    tagline: z.string(),
    navigationTitle: z.string(),
    contactTitle: z.string(),
    legalTitle: z.string(),
    listingsTitle: z.string(),
    addressLabel: z.string(),
    availabilityLabel: z.string(),
    listingsNote: z.string(),
    rights: z.string()
  }),
  seo: z.object({
    home: seoEntrySchema,
    accommodation: seoEntrySchema,
    gallery: seoEntrySchema,
    location: seoEntrySchema,
    availability: seoEntrySchema,
    contact: seoEntrySchema,
    privacy: seoEntrySchema
  }),
  home: z.object({
    hero: heroWithActionsSchema,
    highlights: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(cardSchema)
    }),
    story: z.object({
      title: z.string(),
      lead: z.string(),
      body: z.string(),
      aside: z.string()
    }),
    quickFacts: z.object({
      title: z.string(),
      intro: z.string()
    }),
    reviewSummary: z.object({
      eyebrow: z.string(),
      title: z.string(),
      intro: z.string(),
      sourceLabel: z.string(),
      badgeLabel: z.string(),
      reviewCountLabel: z.string(),
      rankingLabel: z.string()
    }),
    galleryPreview: z.object({
      title: z.string(),
      intro: z.string(),
      cta: z.string()
    }),
    locationPreview: z.object({
      title: z.string(),
      intro: z.string(),
      cta: z.string()
    }),
    availabilityPreview: z.object({
      title: z.string(),
      intro: z.string(),
      cta: z.string()
    }),
    trust: z.object({
      title: z.string(),
      points: z.array(z.string())
    })
  }),
  accommodation: z.object({
    hero: heroSchema,
    overview: z.object({
      title: z.string(),
      paragraphs: z.array(z.string())
    }),
    amenities: z.object({
      title: z.string(),
      items: z.array(cardSchema)
    }),
    spaces: z.object({
      title: z.string(),
      items: z.array(cardSchema)
    }),
    practical: z.object({
      title: z.string(),
      items: z.array(labelValueSchema)
    }),
    roomDetails: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          details: z.array(z.string())
        })
      )
    })
  }),
  gallery: z.object({
    hero: heroSchema,
    introTitle: z.string(),
    introText: z.string(),
    categories: z.array(cardSchema),
    atmosphere: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(videoCardSchema).min(1)
    }),
    note: z.string()
  }),
  location: z.object({
    hero: heroSchema,
    introTitle: z.string(),
    introText: z.string(),
    highlights: z.object({
      title: z.string(),
      items: z.array(cardSchema)
    }),
    gettingHere: z.object({
      title: z.string(),
      steps: z.array(z.string())
    }),
    mapCard: z.object({
      title: z.string(),
      text: z.string(),
      buttonLabel: z.string()
    })
  }),
  availability: z.object({
    hero: heroSchema,
    introTitle: z.string(),
    introText: z.string(),
    legend: z.object({
      available: z.string(),
      limited: z.string(),
      booked: z.string(),
      inquiry: z.string()
    }),
    noteTitle: z.string(),
    noteText: z.string(),
    syncTitle: z.string(),
    syncText: z.string()
  }),
  contact: z.object({
    hero: heroSchema,
    introTitle: z.string(),
    introText: z.string(),
    methodsTitle: z.string(),
    methods: z.array(cardSchema),
    form: z.object({
      title: z.string(),
      intro: z.string(),
      nameLabel: z.string(),
      emailLabel: z.string(),
      phoneLabel: z.string(),
      arrivalLabel: z.string(),
      departureLabel: z.string(),
      guestsLabel: z.string(),
      messageLabel: z.string(),
      messagePlaceholder: z.string(),
      dateHint: z.string(),
      guestsHint: z.string(),
      privacyHint: z.string(),
      submitLabel: z.string(),
      pendingLabel: z.string(),
      successTitle: z.string(),
      successBody: z.string(),
      notConfiguredTitle: z.string(),
      notConfiguredBody: z.string(),
      validationMessage: z.string()
    })
  }),
  privacy: z.object({
    hero: heroSchema,
    introduction: z.string(),
    sections: z.array(
      z.object({
        title: z.string(),
        paragraphs: z.array(z.string())
      })
    ),
    closing: z.string()
  }),
  galleryCaptions: z.record(z.string(), z.string())
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type AtmosphereVideoItem = SiteContent['gallery']['atmosphere']['items'][number];

const rawContent = { hr, en, de, fr, es };

export const contentByLocale: Record<Locale, SiteContent> = Object.fromEntries(
  Object.entries(rawContent).map(([locale, content]) => [
    locale,
    siteContentSchema.parse(content)
  ])
) as Record<Locale, SiteContent>;

export function getSiteContent(locale: Locale) {
  return contentByLocale[locale];
}
