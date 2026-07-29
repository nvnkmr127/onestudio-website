import { Metadata } from 'next';
import GeoClient from './GeoClient';

export const metadata: Metadata = {
  title: 'Geo Landing Pages & NAP Audit | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GeoAdminPage() {
  return <GeoClient />;
}
