import { Metadata } from 'next';
import TrackingClient from './TrackingClient';

export const metadata: Metadata = {
  title: 'Analytics & Pixel Control Plane | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackingAdminPage() {
  return <TrackingClient />;
}
