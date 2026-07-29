// Single source of truth for the public site origin.
// Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. https://onestudio.in).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://onestudio.co'
).replace(/\/$/, '')

export const SITE_NAME = 'One Studio'

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
