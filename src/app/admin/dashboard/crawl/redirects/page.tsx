import { Metadata } from 'next';
import RedirectsClient from './RedirectsClient';

export const metadata: Metadata = {
  title: '301/302 Redirect Manager | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RedirectsAdminPage() {
  return <RedirectsClient />;
}
