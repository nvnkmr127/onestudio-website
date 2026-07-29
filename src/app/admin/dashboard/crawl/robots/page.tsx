import { Metadata } from 'next';
import RobotsClient from './RobotsClient';

export const metadata: Metadata = {
  title: 'robots.txt Crawl Manager | One Studio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RobotsAdminPage() {
  return <RobotsClient />;
}
