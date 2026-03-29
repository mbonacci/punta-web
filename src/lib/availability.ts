import { mockAvailability, type AvailabilityState } from '../data/property';
import type { Locale } from './i18n';

export type AvailabilityMonth = {
  month: string;
  state: AvailabilityState;
};

export interface AvailabilityProvider {
  source: 'mock' | 'ical';
  getAvailability(locale: Locale): AvailabilityMonth[];
}

class MockAvailabilityProvider implements AvailabilityProvider {
  source = 'mock' as const;

  getAvailability(_locale: Locale) {
    return [...mockAvailability];
  }
}

export const availabilityProvider: AvailabilityProvider =
  new MockAvailabilityProvider();

/**
 * Future extension point:
 * Replace `availabilityProvider` with an iCal-backed implementation that fetches
 * and normalizes events from Airbnb / Booking.com calendar URLs during build time.
 */
