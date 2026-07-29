import { Metadata } from 'next';
import SitemapClient from './SitemapClient';

export const metadata: Metadata = {
  title: 'XML Sitemap Engine | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SitemapAdminPage() {
  return <SitemapClient />;
}
