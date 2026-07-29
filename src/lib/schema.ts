// JSON-LD (schema.org) builders. Each returns a plain object to feed <JsonLd>.
import { SITE_URL, SITE_NAME, absoluteUrl } from './site'

type Dict = Record<string, any>

const clean = <T extends Dict>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null && v !== '')) as T

/** Site-wide construction business. GeneralContractor is a LocalBusiness subtype. */
export function localBusinessSchema(settings: Dict | null): Dict {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'InteriorDesign',
    name: SITE_NAME,
    url: SITE_URL,
    email: settings?.email,
    telephone: settings?.phone,
    address: settings?.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address, addressCountry: 'IN' }
      : undefined,
    areaServed: ['Hyderabad', 'Secunderabad', 'Telangana'],
    sameAs: [settings?.facebook, settings?.instagram, settings?.linkedin].filter(Boolean),
  })
}

/** FAQPage from an array of { question, answer }. Returns null if empty. */
export function faqPageSchema(faqs: Dict[] | undefined): Dict | null {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function blogPostingSchema(post: Dict): Dict {
  const authorName =
    typeof post.author === 'object' ? post.author?.name || post.author?.email : undefined
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedDate,
    dateModified: post.updatedAt || post.publishedDate,
    image: post.featuredImage?.url ? absoluteUrl(post.featuredImage.url) : undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/news/${post.slug}`),
  })
}

/** BreadcrumbList from ordered [{ name, path }] items. */
export function breadcrumbSchema(items: { name: string; path: string }[]): Dict {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}
