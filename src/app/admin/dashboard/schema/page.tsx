import { Metadata } from 'next';
import SchemaClient from './SchemaClient';

export const metadata: Metadata = {
  title: 'Schema.org JSON-LD Studio | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SchemaAdminPage() {
  return <SchemaClient />;
}
