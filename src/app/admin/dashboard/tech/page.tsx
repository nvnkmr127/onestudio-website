import { Metadata } from 'next';
import TechSeoClient from './TechSeoClient';

export const metadata: Metadata = {
  title: 'Technical SEO & Link Auditor | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TechAdminPage() {
  return <TechSeoClient />;
}
