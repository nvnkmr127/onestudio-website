import { Metadata } from 'next';
import AuditsClient from './AuditsClient';

export const metadata: Metadata = {
  title: 'SEO Health & Baseline Drift Monitor | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuditsAdminPage() {
  return <AuditsClient />;
}
