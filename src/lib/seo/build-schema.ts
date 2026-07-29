import type { SeoSettings, SchemaBlock, SeoMeta } from '@/lib/types';

/**
 * Build auto-generated Organization & GeneralContractor JSON-LD schemas from verified NAP settings.
 */
export function buildGlobalSchemas(settings: SeoSettings): {
  organization: Record<string, any>;
  localBusiness: Record<string, any>;
} {
  const siteUrl = (settings.site_url || 'https://www.onestudio.co.in').replace(/\/$/, '');
  const logoUrl = settings.default_og_image || `${siteUrl}/og-default.jpg`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: settings.business_name || settings.site_name || 'One Studio',
    url: siteUrl,
    logo: logoUrl,
    email: settings.email || 'reachus@onestudio.co.in',
    telephone: settings.phone || '+91 90143 03409',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.street_address || 'Road No. 36, Jubilee Hills',
      addressLocality: settings.locality || 'Jubilee Hills',
      addressRegion: settings.region || 'Hyderabad, Telangana',
      postalCode: settings.postal_code || '500033',
      addressCountry: settings.country || 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.phone || '+91 90143 03409',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Telugu', 'Hindi'],
      },
    ],
    sameAs: Object.values(settings.social_profiles || {}).filter(Boolean),
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesign',
    '@id': `${siteUrl}/#localbusiness`,
    name: settings.business_name || settings.site_name || 'One Studio',
    url: siteUrl,
    image: logoUrl,
    telephone: settings.phone || '+91 90143 03409',
    email: settings.email || 'reachus@onestudio.co.in',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.street_address || 'Road No. 36, Jubilee Hills',
      addressLocality: settings.locality || 'Jubilee Hills',
      addressRegion: settings.region || 'Hyderabad, Telangana',
      postalCode: settings.postal_code || '500033',
      addressCountry: settings.country || 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.geo_lat || 13.0247,
      longitude: settings.geo_lng || 77.6288,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Bengaluru',
      },
    ],
    openingHoursSpecification: (settings.opening_hours || []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.opens,
      closes: h.closes,
    })),
  };

  return { organization, localBusiness };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate required schema.org fields per @type and enforce guardrails against hardcoded reviews.
 */
export function validateSchemaBlock(type: string, jsonLd: any): ValidationResult {
  const errors: string[] = [];

  if (!jsonLd || typeof jsonLd !== 'object') {
    return { isValid: false, errors: ['JSON-LD must be a valid non-null object.'] };
  }

  if (jsonLd['@context'] !== 'https://schema.org' && jsonLd['@context'] !== 'http://schema.org') {
    errors.push('Schema must include "@context": "https://schema.org"');
  }

  const schemaType = jsonLd['@type'] || type;
  if (!schemaType) {
    errors.push('Schema must include a valid "@type" property.');
  }

  // Guardrail: NO hardcoded aggregateRating or review counts allowed
  if (jsonLd.aggregateRating || jsonLd.ratingValue || jsonLd.reviewCount) {
    errors.push(
      'HARD GUARDRAIL VIOLATION: AggregateRating or review counts cannot be hardcoded in schema blocks. They must connect to a live review provider.'
    );
  }

  switch (schemaType) {
    case 'Organization':
      if (!jsonLd.name) errors.push('Organization requires "name".');
      if (!jsonLd.url) errors.push('Organization requires "url".');
      break;

    case 'GeneralContractor':
    case 'LocalBusiness':
    case 'HomeAndConstructionBusiness':
      if (!jsonLd.name) errors.push(`${schemaType} requires "name".`);
      if (!jsonLd.address) errors.push(`${schemaType} requires "address".`);
      if (!jsonLd.telephone) errors.push(`${schemaType} requires "telephone".`);
      break;

    case 'Service':
      if (!jsonLd.name) errors.push('Service requires "name".');
      if (!jsonLd.provider && !jsonLd.serviceType) {
        errors.push('Service requires "provider" or "serviceType".');
      }
      break;

    case 'FAQPage':
      if (!jsonLd.mainEntity || !Array.isArray(jsonLd.mainEntity) || jsonLd.mainEntity.length === 0) {
        errors.push('FAQPage requires "mainEntity" array containing Question objects.');
      } else {
        jsonLd.mainEntity.forEach((q: any, idx: number) => {
          if (!q.name) errors.push(`FAQ Question #${idx + 1} requires "name".`);
          if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
            errors.push(`FAQ Question #${idx + 1} requires "acceptedAnswer.text".`);
          }
        });
      }
      break;

    case 'BlogPosting':
    case 'Article':
      if (!jsonLd.headline) errors.push('BlogPosting requires "headline".');
      if (!jsonLd.author) errors.push('BlogPosting requires "author".');
      break;

    case 'HowTo':
      if (!jsonLd.name) errors.push('HowTo requires "name".');
      if (!jsonLd.step || !Array.isArray(jsonLd.step)) {
        errors.push('HowTo requires "step" array.');
      }
      break;

    case 'BreadcrumbList':
      if (!jsonLd.itemListElement || !Array.isArray(jsonLd.itemListElement)) {
        errors.push('BreadcrumbList requires "itemListElement" array.');
      }
      break;
  }

  return { isValid: errors.length === 0, errors };
}
