import { property } from '../data/property';

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
  message: string;
};

export type InquiryResult =
  | {
      status: 'success';
      title: string;
      body: string;
    }
  | {
      status: 'not-configured' | 'error';
      title: string;
      body: string;
    };

export interface InquiryAdapter {
  mode: 'frontend-only' | 'form-service' | 'php-endpoint';
  endpoint?: string;
}

export const inquiryAdapter: InquiryAdapter = {
  mode: 'frontend-only'
};

export function getInquiryMailtoUrl(payload?: Partial<InquiryPayload>) {
  const subject = encodeURIComponent(
    `${property.propertyName} inquiry${payload?.arrival ? ` ${payload.arrival}` : ''}`
  );
  const body = encodeURIComponent(
    [
      payload?.name ? `Name: ${payload.name}` : '',
      payload?.email ? `Email: ${payload.email}` : '',
      payload?.phone ? `Phone: ${payload.phone}` : '',
      payload?.arrival ? `Arrival: ${payload.arrival}` : '',
      payload?.departure ? `Departure: ${payload.departure}` : '',
      payload?.guests ? `Guests: ${payload.guests}` : '',
      payload?.message ? `Message:\n${payload.message}` : ''
    ]
      .filter(Boolean)
      .join('\n')
  );

  return `mailto:${property.email}?subject=${subject}&body=${body}`;
}

export function getInquiryWhatsAppUrl(payload?: Partial<InquiryPayload>) {
  const text = encodeURIComponent(
    [
      `Hello, I would like to ask about staying at ${property.propertyName}.`,
      payload?.arrival ? `Arrival: ${payload.arrival}` : '',
      payload?.departure ? `Departure: ${payload.departure}` : '',
      payload?.guests ? `Guests: ${payload.guests}` : '',
      payload?.name ? `Name: ${payload.name}` : '',
      payload?.message ? `Message: ${payload.message}` : ''
    ]
      .filter(Boolean)
      .join('\n')
  );

  return `https://wa.me/${property.whatsappE164.replace('+', '')}?text=${text}`;
}
