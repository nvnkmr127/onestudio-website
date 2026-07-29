import { Metadata } from 'next';
import SettingsClientForm from './SettingsClientForm';

export const metadata: Metadata = {
  title: 'Global SEO Settings | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSettingsPage() {
  return <SettingsClientForm />;
}
