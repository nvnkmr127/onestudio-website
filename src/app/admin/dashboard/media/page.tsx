import { Metadata } from 'next';
import MediaClient from './MediaClient';

export const metadata: Metadata = {
  title: 'Image SEO & Dynamic OG Generator | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MediaAdminPage() {
  return <MediaClient />;
}
